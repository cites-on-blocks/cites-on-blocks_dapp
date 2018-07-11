import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'grommet'
import Web3 from 'web3'

import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import { SPECIES } from '../../util/species'
import { COUNTRIES } from '../../util/countries'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix,
  getWhitelistEvents,
  mergeWhitelistEvents
} from '../../util/permitUtils'

class AnalyticDashboard extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      // permit events
      whitelistEvents: [],
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
      permits: permits
    })
  }

  /**
   * Function to create a series Array of permit types. The array splits the permit
   * in the different types and count them.
   * @returns Array of counted permit types.
   **/

  createPermitSeries() {
    const arr = this.state.permits
    const colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    const result = Object.values(
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

  /**
   * Function to create a sunburst series Array. The array splits the data in
   * countries and count the permit types of each country.
   * @returns Array of split countries and their permit types.
   **/

  createSunburstSeries() {
    const colorsPermit = {
      'RE-EXPORT': 'warning',
      EXPORT: 'ok',
      OTHER: 'critical'
    }
    const arr = this.state.permits
    const result = Object.values(
      arr.reduce((c, { exportCountry, permitType }) => {
        c[exportCountry] = c[exportCountry] || {
          label: exportCountry,
          value: 0,
          colorIndex: COUNTRIES[exportCountry].color,
          children: []
        }
        c[exportCountry].children[permitType] = c[exportCountry].children[
          permitType
        ] || {
          label: permitType,
          value: 0,
          colorIndex: colorsPermit[permitType]
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

  /**
   * Function to get the color code of an species.
   * @returns specific color code.
   **/

  filterByValue(string) {
    const index = SPECIES.findIndex(elem => elem.commonName === string)
    if (index === -1) {
      return 'unknown'
    } else {
      return SPECIES[index].color
    }
  }

  /**
   * Creates an array of all species from the permits. The array is split into
   * countries and counts the number of species based on the quantity.
   * @returns Array of species per country in relation to the whole data set.
   **/

  createSpecimensSeries() {
    const arr = this.state.permits
    const result = Object.values(
      [].concat
        .apply([], arr.map(({ specimens }) => specimens))
        .reduce((r, { commonName, quantity }) => {
          r[commonName] = r[commonName] || {
            label: commonName,
            value: 0,
            colorIndex: this.filterByValue(commonName)
          }
          r[commonName].value += Number(quantity)
          return r
        }, [])
    )
    return result
  }

  /**
   * Creates an array of all worker of a country in relation the the whole data set.
   * The array don't check the worker type.
   * @returns Array of all worker per country.
   **/

  createWorkerSeries() {
    const arr = this.state.whitelistEvents
    const result = Object.values(
      arr.reduce((c, { country }) => {
        c[country] = c[country] || {
          label: country,
          value: 0,
          colorIndex: COUNTRIES[country].color
        }
        c[country].value++
        return c
      }, {})
    )
    return result
  }

  render() {
    return (
      <Box
        pad="none"
        justify="center"
        align="center"
        wrap={true}
        margin="small">
        <Box>
          <Box direction="row" pad="small" justify="center" align="center">
            <AnalyticsMeter
              analyticsTitle={local.analytics.permitChart.headline}
              series={this.createPermitSeries()}
              type="permit"
            />
            <AnalyticsMeter
              analyticsTitle={local.analytics.workChart.headline}
              series={this.createWorkerSeries()}
              type="work"
            />
            <AnalyticsMeter
              analyticsTitle={local.analytics.specimensChart.headline}
              series={this.createSpecimensSeries()}
              type="specimens"
            />
          </Box>
          <Box direction="row" align="center">
            <SunburstChart
              type="permit"
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

AnalyticDashboard.propTypes = {
  accounts: PropTypes.object,
  permits: PropTypes.array,
  whitelist: PropTypes.array
}

AnalyticDashboard.contextTypes = {
  drizzle: PropTypes.object
}

export default AnalyticDashboard
