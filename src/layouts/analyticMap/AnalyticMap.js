import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AnalyticsMapboard from '../../components/AnalyticsMapboard'
import Web3 from 'web3'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix
} from '../../util/permitUtils'
import { Box } from '../../../node_modules/grommet'

class AnalyticMap extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      //permits
      permits: []
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
    await this.getEvents()
    await this.getPermits()
  }

  async getEvents(from = 0) {
    const [createdPermits, confirmedPermits] = await Promise.all([
      getPermitEvents(this.PermitFactory, 'PermitCreated', from),
      getPermitEvents(this.PermitFactory, 'PermitConfirmed', from)
    ])
    const events = createdPermits.concat(confirmedPermits)
    const newEvents = await blockNumberToUnix(this.web3, events)
    const mergedEvents = mergePermitEvents(this.state.events, newEvents).sort(
      (a, b) => b.blockNumber - a.blockNumber
    )
    this.setState({
      ...this.state,
      events: mergedEvents
    })
  }

  async getPermits() {
    let permits = []
    for (const event of this.state.events) {
      const rawPermit = await this.contracts.PermitFactory.methods
        .getPermit(event.permitHash)
        .call()
      const parsedPermit = parseRawPermit(rawPermit)
      const specimenPromises = parsedPermit.specimenHashes.map(s =>
        this.contracts.PermitFactory.methods.specimens(s).call()
      )
      const rawSpecimens = await Promise.all(specimenPromises)
      const parsedSpecimens = rawSpecimens.map(s => parseRawSpecimen(s))
      permits.push({
        ...parsedPermit,
        specimens: parsedSpecimens,
        status: event.status,
        timestamp: event.timestamp,
        permitHash: event.permitHash
      })
    }
    this.setState({
      permits
    })
  }

  render() {
    return (
      <Box
        direction="row"
        justify="start"
        align="start"
        pad="none"
        margin="none"
        colorIndex="light-1">
        <AnalyticsMapboard permits={this.state.permits} />
      </Box>
    )
  }
}

AnalyticMap.propTypes = {
  accounts: PropTypes.object,
  permits: PropTypes.array
}

AnalyticMap.contextTypes = {
  drizzle: PropTypes.object
}

export default AnalyticMap
