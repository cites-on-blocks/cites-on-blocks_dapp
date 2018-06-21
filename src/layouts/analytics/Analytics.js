import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MonitorIcon from 'grommet/components/icons/base/Monitor'
import { Box, Sidebar, Header, Footer, Title, Anchor, Menu } from 'grommet'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import local from '../../localization/localizedStrings'
import Web3 from 'web3'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix
} from '../../util/permitUtils'

class Analytics extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      //permits
      permits: []
      //permit Chart Variables
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

  createPermitSeries() {
    let arr = this.state.permits
    let colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    let result = Object.values(
      arr.reduce((c, { permitType }) => {
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

  createSunburstSeries() {
    let colors = [
      'warning',
      'ok',
      'critical',
      'accent-2',
      'neutral-2',
      'accent-1'
    ]

    let arr = this.state.permits
    var result = Object.values(
      arr.reduce((c, { exportCountry, permitType }) => {
        c[exportCountry] = c[exportCountry] || {
          label: exportCountry,
          value: 0,
          colorIndex: colors[Math.floor(Math.random() * colors.length)],
          children: []
        }
        c[exportCountry].children[permitType] = c[exportCountry].children[
          permitType
        ] || {
          label: permitType,
          value: 0,
          colorIndex: colors[Math.floor(Math.random() * colors.length)]
        }
        c[exportCountry].children[permitType].value++
        c[exportCountry].value++
        return c
      }, {})
    ).map(o => {
      o.children = Object.values(o.children)
      return o
    })
    return result
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

  createSpecimensSeries() {
    let arr = this.state.permits
    let colors = [
      'warning',
      'ok',
      'critical',
      'accent-2',
      'neutral-2',
      'accent-1'
    ]
    const result = Object.values(
      [].concat
        .apply([], arr.map(({ specimens }) => specimens))
        .reduce((r, { commonName }) => {
          r[commonName] = r[commonName] || {
            label: commonName,
            value: 0,
            colorIndex: colors[Math.floor(Math.random() * colors.length)]
          }
          r[commonName].value++
          return r
        }, [])
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

  render() {
    console.log(this.createSunburstSeries())
    return (
      <Box
        direction="row"
        justify="start"
        align="start"
        wrap={true}
        pad="none"
        margin="none"
        colorIndex="light-1">
        <Sidebar colorIndex="light-2" fixed={true}>
          <Header pad="medium" justify="between">
            <Title>{local.analytics.headline}</Title>
          </Header>
          <Box flex="grow" justify="start">
            <Menu primary={true}>
              <Anchor className="active">
                <MonitorIcon />
                {local.analytics.menu}
              </Anchor>
            </Menu>
          </Box>
          <Footer />
        </Sidebar>
        <Box
          pad="none"
          justify="center"
          align="center"
          wrap={true}
          margin="small">
          <Box direction="row" pad="small" justify="center" align="center">
            <AnalyticsMeter
              analyticsTitle={local.analytics.permitChart.headline}
              permitTotal={this.state.permits.length}
              series={this.createPermitSeries()}
            />
            <AnalyticsMeter
              analyticsTitle={local.analytics.workChart.headline}
              permitTotal={this.state.permits.length}
              series={this.createSpecimensSeries()}
            />
            <AnalyticsMeter
              analyticsTitle={local.analytics.specimensChart.headline}
              permitTotal={this.state.permits.length}
              series={this.createSpecimensSeries()}
            />
          </Box>
          <Box direction="row" align="center">
            <SunburstChart
              analyticsTitle={local.analytics.sunburstChart.headline}
              permitTotal={this.state.permits.length}
              series={this.createSunburstSeries()}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

Analytics.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  series: PropTypes.array
}

Analytics.contextTypes = {
  drizzle: PropTypes.object
}

export default Analytics
