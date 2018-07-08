import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Select, FormField, Paragraph } from 'grommet'
import Web3 from 'web3'

import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import { SPECIES } from '../../util/species'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix,
  getWhitelistEvents,
  mergeWhitelistEvents
} from '../../util/permitUtils'

class AnalyticCountryDashboard extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      // permit events
      whitelistEvents: [],
      country: local.analytics.pleaseSelect,
      //permits
      permits: [],
      whitelist: [],
      originpermits: [],
      originwhitelist: []
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
      originpermits: permits
    })
  }

  changeCountry(countryTyp) {
    let permitArray = this.state.originpermits
    let permitResult = permitArray.filter(
      country => country.exportCountry === countryTyp
    )
    this.setState({
      permits: permitResult,
      country: countryTyp
    })
    let whitelistArray = this.state.whitelistEvents
    let whitelistResult = whitelistArray.filter(
      country => country.country === countryTyp
    )
    this.setState({
      whitelist: whitelistResult
    })
  }

  /**
   * Function to transform the whitelist events to an array of countries.
   * The array supports the country select option.
   * @returns Array of counting species per permit type.
   **/

  transformWhitelistArray() {
    let whitelistArray = this.state.whitelistEvents
    const result = Object.values(
      whitelistArray.reduce((c, { country }) => {
        c[country] = c[country] || {
          exportCountry: country
        }
        return c
      }, {})
    )
    return result
  }

  getCountrySelect() {
    let permit = this.state.permits
    let whitelist = this.transformWhitelistArray()
    const result = Object.values(
      permit.concat(whitelist).reduce((c, { exportCountry }) => {
        c[exportCountry] = c[exportCountry] || {
          label: exportCountry,
          value: exportCountry
        }
        return c
      }, {})
    )
    return result
  }

  /**
   * Function to create a series Array of permit types of each country. The array splits the permit
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
   * Function to create a sunburst series Array. The array splits the data of
   * a country into the permit types and count species of each permit type.
   * @returns Array of counting species per permit type.
   **/

  createSunburstSpecimens() {
    const colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    const arr = this.state.permits
    const result = Object.values(
      arr.reduce((c, { permitType, specimens }) => {
        c[permitType] = c[permitType] || {
          label: permitType,
          value: 0,
          colorIndex: colors[permitType],
          children: []
        }
        specimens.reduce((p, { commonName, quantity }) => {
          c[permitType].children[commonName] = c[permitType].children[
            commonName
          ] || {
            label: commonName,
            value: 0,
            colorIndex: this.filterByValue(commonName)
          }
          c[permitType].children[commonName].value += Number(quantity)
        }, {})
        c[permitType].value++
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
   * Creates an array of all species from the permits of a country.
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
   * Creates an array of all worker types of a country.
   * The array checks the worker type and counts each type.
   * @returns Array of all worker per country.
   **/

  createWorkerSeries() {
    const colors = { AddressWhitelisted: 'ok', AddressRemoved: 'critical' }
    const arr = this.state.whitelist
    const result = Object.values(
      arr.reduce((c, { event }) => {
        c[event] = c[event] || {
          label: event === 'AddressWhitelisted' ? 'whitelisted' : 'removed',
          value: 0,
          colorIndex: colors[event]
        }
        c[event].value++
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
        <FormField label={'Select Country'}>
          <Select
            value={this.state.country}
            options={this.getCountrySelect()}
            onChange={({ option }) => {
              this.changeCountry(option.value)
            }}
          />
        </FormField>
        {this.state.country === local.analytics.pleaseSelect ? (
          <Paragraph style={{ color: 'red' }}>
            {local.analytics.pleaseSelect}
          </Paragraph>
        ) : (
          <Box>
            <Box pad="none">
              <Box direction="row" pad="none" justify="center" align="center">
                <AnalyticsMeter
                  analyticsTitle={local.analytics.permitChart.headline}
                  series={this.createPermitSeries()}
                  type="permit"
                />
                <AnalyticsMeter
                  analyticsTitle={local.analytics.workChart.headline}
                  series={this.createWorkerSeries()}
                  type="workCountry"
                />
                <AnalyticsMeter
                  analyticsTitle={local.analytics.specimensChart.headline}
                  series={this.createSpecimensSeries()}
                  type="specimens"
                />
              </Box>
            </Box>
            <Box direction="row" align="center">
              <SunburstChart
                type="country"
                analyticsTitle={local.analytics.sunburstChart.headlineCountry}
                permitTotal={this.state.permits.length}
                series={this.createSunburstSpecimens()}
              />
            </Box>
          </Box>
        )}
      </Box>
    )
  }
}

AnalyticCountryDashboard.propTypes = {
  accounts: PropTypes.object,
  permits: PropTypes.array,
  whitelist: PropTypes.array
}

AnalyticCountryDashboard.contextTypes = {
  drizzle: PropTypes.object
}

export default AnalyticCountryDashboard
