import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Select, FormField } from 'grommet'
import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import { species } from '../../util/species'

class AnalyticsCountryboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'error',
      country: '',
      permits: [],
      originpermits: [],
      originwhitelist: [],
      whitelist: []
    }
  }

  componentDidMount() {
    this.setState({
      permits: this.props.permits,
      originpermits: this.props.permits,
      whitelist: this.props.whitelist,
      originwhitelist: this.props.whitelist
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
    let whitelistArray = this.state.originwhitelist
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
    let whitelistArray = this.state.originwhitelist
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
    let permit = this.state.originpermits
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
    const index = species.findIndex(elem => elem.commonName === string)
    if (index === -1) {
      return 'unknown'
    } else {
      return species[index].color
    }
  }

  /**
   * Creates an array of all species from the permits of a country.
   * @returns Array of species per country in relation to the whole data set.
   **/

  createSpecimensSeries() {
    const arr = this.props.permits
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
        <Box>
          <FormField label={'Select Country'}>
            <Select
              value={this.state.country}
              options={this.getCountrySelect()}
              onChange={({ option }) => {
                this.changeCountry(option.value)
              }}
            />
          </FormField>
          <Box direction="row" pad="small" justify="center" align="center">
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
    )
  }
}

AnalyticsCountryboard.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permits: PropTypes.array,
  whitelist: PropTypes.array
}

export default AnalyticsCountryboard
