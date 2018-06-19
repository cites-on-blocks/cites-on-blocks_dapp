import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Title } from 'grommet'
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'

class AnalyticsMeter extends Component {
  render() {
    return (
      <Box colorIndex="light-1" wrap={true} pad="small" margin="none">
        <Title>{this.props.analyticsTitle}</Title>
        <AnnotatedMeter
          type="circle"
          max={this.props.permitTotal}
          size="small"
          series={this.props.series}
          legend={false}
        />
      </Box>
    )
  }
}

AnalyticsMeter.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  series: PropTypes.array
}

export default AnalyticsMeter
