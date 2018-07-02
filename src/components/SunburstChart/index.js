import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Title, Legend, SunBurst, Value, Label } from 'grommet'

class SunburstChart extends Component {
  constructor() {
    super()
    this.state = {}
  }

  seriesForPath(path) {
    path = path.slice(0)
    let data = { children: this.props.series }
    let series = []
    while (path.length > 0) {
      data = data.children[path.shift()]
      series.push({
        colorIndex: data.colorIndex,
        label: data.label,
        value: data.value
      })
    }
    return series
  }

  render() {
    const { active } = this.state
    let label
    if (active) {
      const series = this.seriesForPath(active).map(data => ({
        ...data,
        value: <Value value={data.value} size="small" />
      }))
      label = <Legend series={series} />
    }
    return (
      <Box direction="row" align="center">
        <Box pad="none" margin="none">
          <Title>{this.props.analyticsTitle}</Title>
          <SunBurst
            active={active}
            onActive={path => this.setState({ active: path })}
            data={this.props.series}
            label={label}
          />
        </Box>
        <Box>
          <Label>Permit count</Label>
          <Legend series={this.props.series} />
        </Box>
      </Box>
    )
  }
}

SunburstChart.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  series: PropTypes.array
}

export default SunburstChart
