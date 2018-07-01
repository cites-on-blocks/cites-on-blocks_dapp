import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MonitorIcon from 'grommet/components/icons/base/Monitor'
import MapIcon from 'grommet/components/icons/base/Map'
import FlagIcon from 'grommet/components/icons/base/Flag'
import { Box, Sidebar, Header, Footer, Title, Anchor, Menu } from 'grommet'
import AnalyticsDashboard from '../../components/AnalyticsDashboard'
import AnalyticsCountryboard from '../../components/AnalyticsCountryboard'
import AnalyticsMapboard from '../../components/AnalyticsMapboard'
import local from '../../localization/localizedStrings'
import Web3 from 'web3'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix,
  getWhitelistEvents,
  mergeWhitelistEvents
} from '../../util/permitUtils'

class Analytics extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      // permit events
      whitelistEvents: [],
      //permits
      permits: [],
      dashboard: true,
      country: false,
      map: false
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
    await this.getWhitelistedEvents()
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

  async getWhitelistedEvents(from = 0) {
    const [addWhitelist, removedWhitelist] = await Promise.all([
      getWhitelistEvents(this.PermitFactory, 'AddressWhitelisted', from),
      getWhitelistEvents(this.PermitFactory, 'AddressRemoved', from)
    ])
    const whitelistEvents = addWhitelist.concat(removedWhitelist)
    const newWhitelistEvents = await blockNumberToUnix(
      this.web3,
      whitelistEvents
    )
    const mergedWhitelistEvents = mergeWhitelistEvents(
      whitelistEvents,
      newWhitelistEvents
    )
    this.setState({
      ...this.state,
      whitelistEvents: mergedWhitelistEvents
    })
  }

  createFilterExportSeries(filter) {
    let colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    let arr = this.state.permits
    let filtered = arr.filter(permit => permit.exportCountry === filter)
    let result = Object.values(
      filtered.reduce((c, { permitType }) => {
        c[permitType] = c[permitType] || {
          label: permitType,
          value: 0,
          colorIndex: colors[permitType]
        }
        c[permitType].value++
        return c
      }, {})
    )
    return result
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

  getDashboardClass() {
    if (this.state.dashboard === true) {
      return 'active'
    } else {
      return ''
    }
  }

  getCountryboardClass() {
    if (this.state.country === true) {
      return 'active'
    } else {
      return ''
    }
  }

  getMapboardClass() {
    if (this.state.map === true) {
      return 'active'
    } else {
      return ''
    }
  }

  render() {
    console.log(this.state.whitelistEvents)
    return (
      <Box
        direction="row"
        justify="start"
        align="start"
        pad="none"
        margin="none"
        colorIndex="light-1">
        <Sidebar colorIndex="light-2" fixed={true}>
          <Header pad="medium" justify="between">
            <Title>{local.analytics.headline}</Title>
          </Header>
          <Box flex="grow" justify="start">
            <Menu primary={true}>
              <Anchor
                className={this.getDashboardClass()}
                onClick={() =>
                  this.setState({
                    dashboard: true,
                    country: false,
                    map: false
                  })
                }>
                <MonitorIcon />
                {local.analytics.menu}
              </Anchor>
              <Anchor
                className={this.getCountryboardClass()}
                onClick={() =>
                  this.setState({
                    dashboard: false,
                    country: true,
                    map: false
                  })
                }>
                <FlagIcon />
                {local.analytics.country}
              </Anchor>
              <Anchor
                className={this.getMapboardClass()}
                onClick={() =>
                  this.setState({
                    dashboard: false,
                    country: false,
                    map: true
                  })
                }>
                <MapIcon />
                Map
              </Anchor>
            </Menu>
          </Box>
          <Footer />
        </Sidebar>
        {this.state.dashboard ? (
          <AnalyticsDashboard
            permits={this.state.permits}
            whitelist={this.state.whitelistEvents}
          />
        ) : null}
        {this.state.country ? (
          <AnalyticsCountryboard
            permits={this.state.permits}
            whitelist={this.state.whitelistEvents}
          />
        ) : null}
        {this.state.map ? (
          <AnalyticsMapboard permits={this.state.permits} />
        ) : null}
      </Box>
    )
  }
}

Analytics.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  series: PropTypes.array,
  permits: PropTypes.array,
  whitelist: PropTypes.array
}

Analytics.contextTypes = {
  drizzle: PropTypes.object
}

export default Analytics
