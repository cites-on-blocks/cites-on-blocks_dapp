import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'grommet'
import AmCharts from '@amcharts/amcharts3-react'
import { countries } from '../../util/country'

class AnalyticsMapboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'error'
    }
  }

  createPoints() {
    let colors = {
      'accent-2': '#ff7d28',
      brand: '#865cd6',
      warning: '#ffd602',
      ok: '#8cc800',
      critical: '#ff324d',
      'accent-1-t': '#0dcfec',
      'neutral-1': '#0a64a0',
      'neutral-2': '#dc2878 ',
      'neutral-3': '#501eb4'
    }
    let arr = this.props.permits
    let result = Object.values(
      arr.reduce((c, { exportCountry }) => {
        c[exportCountry] = c[exportCountry] || {
          type: 'circle',
          theme: 'light',
          width: 20,
          height: 20,
          value: 0,
          title: countries[exportCountry].name,
          color: colors[countries[exportCountry].color],
          longitude: countries[exportCountry].longitude,
          latitude: countries[exportCountry].latitude
        }
        if (c[exportCountry].width < 70) {
          c[exportCountry].width++
          c[exportCountry].height++
        }
        c[exportCountry].value++
        return c
      }, {})
    )
    return result
  }

  render() {
    this.createPoints()

    const config = {
      type: 'map',
      theme: 'light',
      titles: [
        {
          text: 'Permits on the World Map',
          size: 14
        }
      ],
      projection: 'mercator',
      dataProvider: {
        map: 'worldLow',
        images: this.createPoints()
      },
      areasSettings: {
        //"unlistedAreasColor": "#000000",
        //"unlistedAreasAlpha": 0.1
      },
      export: {
        enabled: true
      }
    }

    return (
      <Box
        pad="none"
        justify="center"
        align="center"
        wrap={true}
        responsive={true}
        full={true}>
        <AmCharts.React
          style={{ width: '100%', height: '80%' }}
          options={config}
        />
      </Box>
    )
  }
}

AnalyticsMapboard.propTypes = {
  accounts: PropTypes.object,
  permits: PropTypes.array
}

export default AnalyticsMapboard
