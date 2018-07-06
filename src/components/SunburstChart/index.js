import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Title, Legend, SunBurst, Value, Label } from 'grommet'
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation'
import AnalyticsModal from '../../components/AnalyticsModal'
import local from '../../localization/localizedStrings'

class SunburstChart extends Component {
  constructor() {
    super()
    this.state = {
      modal: {
        show: false,
        text: '',
        title: ''
      },
      type: 'error'
    }
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

  closeModal() {
    this.setState({
      modal: {
        show: false,
        text: '',
        title: ''
      }
    })
  }

  changeModalType(type) {
    if (type === 'permit') {
      this.setState({
        modal: {
          show: true,
          text: local.analytics.sunburstChart.analyticText,
          title: local.analytics.sunburstChart.headline
        },
        type: 'permit'
      })
    } else if (type === 'country') {
      this.setState({
        modal: {
          show: true,
          text: local.analytics.sunburstChart.analyticCountryText,
          title: local.analytics.sunburstChart.headlineCountry
        },
        type: 'country'
      })
    } else {
      this.setState({
        modal: {
          show: false,
          text: local.error,
          title: 'Error'
        },
        type: 'error'
      })
    }
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
        {this.state.modal.show ? (
          <AnalyticsModal
            title={this.state.modal.title}
            text={this.state.modal.text}
            closer={true}
            onClose={() => this.closeModal()}
          />
        ) : null}
        <Box pad="none" margin="none">
          <Box direction="row" align="center" justify="start">
            <Title>{this.props.analyticsTitle}</Title>
            <CircleInformationIcon
              className="info-button"
              onClick={() => this.changeModalType(this.props.type)}
            />
          </Box>
          <SunBurst
            active={active}
            onActive={path => this.setState({ active: path })}
            data={this.props.series}
            label={label}
          />
        </Box>
        <Box>
          {this.state.type === 'permit' ? (
            <Label>{local.analytics.sunburstChart.legend}</Label>
          ) : (
            <Label>{local.analytics.sunburstChart.legendCountry}</Label>
          )}
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
  series: PropTypes.array,
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.func
}

export default SunburstChart
