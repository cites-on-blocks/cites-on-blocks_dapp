import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'grommet'
import local from '../../localization/localizedStrings'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import SunburstChart from '../../components/SunburstChart'
import { countries } from '../../util/country'
import { species } from '../../util/species'

class AnalyticsDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'error'
    }
  }

  /**
   * Function to create a series Array of permit types. The array splits the permit
   * in the different types and count them.
   * @returns Array of counted permit types.
   **/

  createPermitSeries() {
    const arr = this.props.permits
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
    const arr = this.props.permits
    const result = Object.values(
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
   * Creates an array of all species from the permits. The array is split into
   * countries and counts the number of species based on the quantity.
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
   * Creates an array of all worker of a country in relation the the whole data set.
   * The array don't check the worker type.
   * @returns Array of all worker per country.
   **/

  createWorkerSeries() {
    const arr = this.props.whitelist
    const result = Object.values(
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
            type="permit"
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
