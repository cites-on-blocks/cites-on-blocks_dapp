import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Table, TableRow, Timestamp } from 'grommet'
import Web3, { utils } from 'web3'

import PermitDetailsModal from '../../components/PermitDetailsModal'
import { trimHash } from '../../util/stringUtils'
import { parseRawPermit, parseRawSpecimen } from '../../util/permitUtils'

class Permits extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      events: [],
      selectedPermit: ''
    }
    this.contracts = context.drizzle.contracts
    // NOTE: We have to iniate a new web3 instance for retrieving event via `getPastEvents`.
    //       MetaMask does not support websockets and Drizzle retrieves events via subscriptions.
    const web3 = new Web3(this.contracts.PermitFactory.givenProvider)
    const { abi, address } = this.contracts.PermitFactory
    this.PermitFactory = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  componentDidMount() {
    this.getEvents()
  }

  getEvents(from = 0) {
    const options = {
      fromBlock: from
    }
    Promise.all([
      this.PermitFactory.getPastEvents('PermitCreated', options),
      this.PermitFactory.getPastEvents('PermitConfirmed', options)
    ])
      .then(([createdPermits, confirmedPermits]) => {
        const events = createdPermits
          .concat(confirmedPermits)
          .sort((a, b) => a.blockNumber < b.blockNumber)
          .map(e => this.formatEvent(e))
        this.blockNumberToUnix(events)
        return
      })
      .catch(error => console.log(error))
  }

  formatEvent(permitEvent) {
    const { blockNumber, event, returnValues } = permitEvent
    const { permitHash, exportCountry, importCountry } = returnValues
    return {
      event,
      blockNumber,
      permitHash,
      exportCountry: utils.hexToUtf8(exportCountry),
      importCountry: utils.hexToUtf8(importCountry),
      status: event === 'PermitCreated' ? 'created' : 'processed'
    }
  }

  blockNumberToUnix(events) {
    const blockPromises = events.map(e =>
      this.web3.eth.getBlock(e.blockNumber, false)
    )
    Promise.all(blockPromises)
      .then(blocks => {
        const eventsWithTime = events.map((e, i) => ({
          ...e,
          // convert seconds into miliseconds
          timestamp: blocks[i].timestamp * 1000
        }))
        this.setState({
          events: eventsWithTime
        })
        return
      })
      .catch(error => console.log(error))
  }

  handleSelect(event) {
    let selectedPermit
    this.contracts.PermitFactory.methods
      .getPermit(event.permitHash)
      .call()
      .then(rawPermit => parseRawPermit(rawPermit))
      .then(parsedPermit => {
        selectedPermit = parsedPermit
        const specimenPromises = parsedPermit.specimenHashes.map(s =>
          this.contracts.PermitFactory.methods.specimens(s).call()
        )
        return Promise.all(specimenPromises)
      })
      .then(rawSpecimens => {
        const parsedSpecimens = rawSpecimens.map(s => parseRawSpecimen(s))
        this.setState({
          selectedPermit: {
            ...selectedPermit,
            specimens: parsedSpecimens,
            status: event.status,
            timestamp: event.timestamp,
            permitHash: event.permitHash
          }
        })
        return
      })
      .catch(error => console.log(error))
  }

  onDeselect() {
    this.setState({
      selectedPermit: ''
    })
  }

  render() {
    return (
      <Box>
        {this.state.selectedPermit && (
          <PermitDetailsModal
            permit={this.state.selectedPermit}
            onClose={() => this.onDeselect()}
          />
        )}
        <Table>
          <thead>
            <tr>
              <th>Permit number</th>
              <th>Country of export</th>
              <th>Country of import</th>
              <th>Date</th>
              <th>Status</th>
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
  PermitFactory: PropTypes.object
}

Permits.contextTypes = {
  drizzle: PropTypes.object
}

export default Permits
