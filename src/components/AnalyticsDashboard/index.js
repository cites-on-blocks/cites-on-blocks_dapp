import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'grommet'
import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import { countries } from '../../util/country'

class AnalyticsDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'error'
    }
  }

  createPermitSeries() {
    let arr = this.props.permits
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
    let colorsPermit = {
      'RE-EXPORT': 'warning',
      EXPORT: 'ok',
      OTHER: 'critical'
    }
    let arr = this.props.permits
    var result = Object.values(
      arr.reduce((c, { exportCountry, permitType }) => {
        c[exportCountry] = c[exportCountry] || {
          label: exportCountry,
          value: 0,
          colorIndex: countries[exportCountry].color,
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

  createSpecimensSeries() {
    let arr = this.props.permits
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
    return result
  }

  createWorkerSeries() {
    let arr = this.props.whitelist
    let result = Object.values(
      arr.reduce((c, { country }) => {
        c[country] = c[country] || {
          label: country,
          value: 0,
          colorIndex: countries[country].color
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
        </Box>
        <Box direction="row" align="center">
          <SunburstChart
            analyticsTitle={local.analytics.sunburstChart.headline}
            permitTotal={this.props.permits.length}
            series={this.createSunburstSeries()}
          />
        </Box>
      </Box>
    )
  }
}

AnalyticsDashboard.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  permits: PropTypes.array,
  whitelist: PropTypes.array
}

export default AnalyticsDashboard
