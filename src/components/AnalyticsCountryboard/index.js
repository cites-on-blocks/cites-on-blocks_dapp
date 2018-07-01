import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Select, FormField } from 'grommet'
import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'

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

  transformWhitelistArray() {
    let whitelistArray = this.state.originwhitelist
    let result = Object.values(
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
    let result = Object.values(
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

  createSunburstSpecimens() {
    let colorsSpecimens = [
      'warning',
      'ok',
      'critical',
      'accent-2',
      'neutral-2',
      'accent-1'
    ]
    let colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    let arr = this.state.permits
    var result = Object.values(
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
            colorIndex:
              colorsSpecimens[
                Math.floor(Math.random() * colorsSpecimens.length)
              ]
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
        .reduce((r, { commonName, quantity }) => {
          r[commonName] = r[commonName] || {
            label: commonName,
            value: 0,
            colorIndex: colors[Math.floor(Math.random() * colors.length)]
          }
          r[commonName].value += Number(quantity)
          return r
        }, [])
    )
    console.log(result)
    return result
  }

  createWorkerSeries() {
    let colors = { AddressWhitelisted: 'ok', AddressRemoved: 'critical' }
    let arr = this.state.whitelist
    let result = Object.values(
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
              type="work"
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
