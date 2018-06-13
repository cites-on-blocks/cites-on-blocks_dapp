import React, { Component } from 'react'
import PropTypes from 'prop-types'
import local from '../../localization/localizedStrings'
import {
  Box,
  Columns,
  Button,
  Table,
  TableRow,
  Timestamp,
  Heading
} from 'grommet'
import Web3, { utils } from 'web3'

import PermitDetailsModal from '../../components/PermitDetailsModal'
import PendingTxModal from '../../components/PendingTxModal'

import { trimHash } from '../../util/stringUtils'
import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix
} from '../../util/permitUtils'

class Permits extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      // selected permit for detailed information
      selectedPermit: '',
      // latest block for retrieved events
      latestBlock: 0,
      // country of user
      authCountry: '',
      // tx information modal
      modal: {
        show: false,
        text: ''
      },
      txStatus: ''
    }
    this.contracts = context.drizzle.contracts
    // NOTE: We have to iniate a new web3 instance for retrieving event via `getPastEvents`.
    //       MetaMask does not support websockets and Drizzle retrieves events via subscriptions.
    const web3 = new Web3(this.contracts.PermitFactory.givenProvider)
    const { abi, address } = this.contracts.PermitFactory
    this.PermitFactory = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  async componentDidMount() {
    await Promise.all([this.getEvents(), this.setAuthCountry()])
    // NOTE: Initiate our own event listener because we can not use reactive event data with
    //       MetaMask and Drizzle.
    this.intervalId = setInterval(async () => {
      const blockNumber = await this.web3.eth.getBlockNumber()
      if (blockNumber > this.state.latestBlock) {
        this.getEvents(blockNumber)
      }
    }, 3000)
  }

  componentDidUpdate(prevProps, prevState) {
    // check if accounts changed
    if (this.props.accounts[0] !== prevProps.accounts[0]) {
      this.setAuthCountry()
    }
    // check if tx for stack id exists
    if (this.props.transactionStack[this.stackId]) {
      const txHash = this.props.transactionStack[this.stackId]
      const { status } = this.props.transactions[txHash]
      // change tx related state is status changed
      if (prevState.txStatus !== status) {
        this.changeTxState(status)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  async getEvents(from = 0) {
    const [createdPermits, confirmedPermits] = await Promise.all([
      getPermitEvents(this.PermitFactory, 'PermitCreated', from),
      getPermitEvents(this.PermitFactory, 'PermitConfirmed', from)
    ])
    const events = createdPermits.concat(confirmedPermits)
    if (events.length > 0) {
      const newEvents = await blockNumberToUnix(this.web3, events)
      const mergedEvents = mergePermitEvents(this.state.events, newEvents).sort(
        (a, b) => b.blockNumber - a.blockNumber
      )
      this.setState({
        ...this.state,
        latestBlock: events[0].blockNumber,
        events: mergedEvents
      })
    }
  }

  async handleSelect(event) {
    const rawPermit = await this.contracts.PermitFactory.methods
      .getPermit(event.permitHash)
      .call()
    const parsedPermit = parseRawPermit(rawPermit)
    const specimenPromises = parsedPermit.specimenHashes.map(s =>
      this.contracts.PermitFactory.methods.specimens(s).call()
    )
    const rawSpecimens = await Promise.all(specimenPromises)
    const parsedSpecimens = rawSpecimens.map(s => parseRawSpecimen(s))
    this.setState({
      selectedPermit: {
        ...parsedPermit,
        specimens: parsedSpecimens,
        status: event.status,
        timestamp: event.timestamp,
        permitHash: event.permitHash
      }
    })
  }

  async setAuthCountry() {
    const country = await this.PermitFactory.methods
      .authorityToCountry(this.props.accounts[0])
      .call()
    this.setState({
      authCountry: utils.hexToUtf8(country)
    })
  }

  processPermit(isAccepted) {
    // stack id used for monitoring transaction
    this.stackId = this.contracts.PermitFactory.methods.confirmPermit.cacheSend(
      this.state.selectedPermit.permitHash,
      this.state.selectedPermit.specimenHashes,
      isAccepted,
      { from: this.props.accounts[0] }
    )
  }

  onDeselect() {
    this.setState({
      selectedPermit: ''
    })
  }

  closeTxModal() {
    this.setState({
      txStatus: '',
      modal: {
        show: false,
        text: ''
      }
    })
  }

  changeTxState(newTxState) {
    this.onDeselect()
    if (newTxState === 'pending') {
      this.setState({
        txStatus: 'pending',
        modal: {
          show: true,
          text: 'Permit process pending...'
        }
      })
    } else if (newTxState === 'success') {
      this.stackId = ''
      this.setState({
        txStatus: 'success',
        modal: {
          show: true,
          text: 'Permit process successful!'
        }
      })
    } else {
      this.stackId = ''
      this.setState({
        txStatus: 'failed',
        modal: {
          show: true,
          text: 'Permit process failed.'
        }
      })
    }
  }

  render() {
    const { selectedPermit, authCountry } = this.state
    return (
      <Box>
        {selectedPermit && (
          <PermitDetailsModal
            permit={selectedPermit}
            onClose={() => this.onDeselect()}
            detailsActions={
              selectedPermit.importCountry === authCountry &&
              selectedPermit.status !== 'processed' && (
                <Columns justify={'between'} size={'small'}>
                  <Button
                    secondary={true}
                    label={'Decline'}
                    onClick={() => this.processPermit(false)}
                  />
                  <Button
                    label={'Confirm'}
                    onClick={() => this.processPermit(true)}
                  />
                </Columns>
              )
            }
          />
        )}
        {this.state.modal.show && (
          <PendingTxModal
            txStatus={this.state.txStatus}
            text={this.state.modal.text}
            onClose={() => this.closeTxModal()}
          />
        )}
        <Heading tag={'h2'} align={'center'} margin={'medium'}>
          {local.permits.permits}
        </Heading>
        <Table>
          <thead>
            <tr>
              <th>{local.permits.permitNumber}</th>
              <th>{local.permits.countryOfExport}</th>
              <th>{local.permits.countryOfImport}</th>
              <th>{local.permits.lastUpdate}</th>
              <th>{local.permits.status}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.events.map((event, i) => (
              <TableRow key={i} onClick={() => this.handleSelect(event)}>
                <td>{trimHash(event.permitHash)}</td>
                <td>{event.exportCountry}</td>
                <td>{event.importCountry}</td>
                <td>
                  <Timestamp value={event.timestamp} />
                </td>
                <td>{event.status}</td>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Box>
    )
  }
}

Permits.propTypes = {
  accounts: PropTypes.object,
  PermitFactory: PropTypes.object,
  transactionStack: PropTypes.array,
  transactions: PropTypes.object
}

Permits.contextTypes = {
  drizzle: PropTypes.object
}

export default Permits
