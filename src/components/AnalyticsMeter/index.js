import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Title } from 'grommet'
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'
import CircleInformationIcon from 'grommet/components/icons/base/CircleInformation'
import AnalyticsModal from '../../components/AnalyticsModal'
import local from '../../localization/localizedStrings'

import '../../css/analytics.css'

class AnalyticsMeter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: {
        show: false,
        text: '',
        title: ''
      },
      type: 'error'
    }
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
          text: local.analytics.permitChart.analyticText,
          title: local.analytics.permitChart.analyticsTitle
        },
        type: 'permit'
      })
    } else if (type === 'work') {
      this.setState({
        modal: {
          show: true,
          text: local.analytics.workChart.analyticText,
          title: local.analytics.workChart.analyticsTitle
        },
        type: 'work'
      })
    } else if (type === 'specimens') {
      this.setState({
        modal: {
          show: true,
          text: local.analytics.specimensChart.analyticText,
          title: local.analytics.specimensChart.analyticsTitle
        },
        type: 'specimens'
      })
    } else if (type === 'workCountry') {
      this.setState({
        modal: {
          show: true,
          text: local.analytics.workChart.analyticCountryText,
          title: local.analytics.workChart.analyticsTitle
        },
        type: 'specimens'
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

  totalCount(arr) {
    let score = arr.reduce((sum, { value }) => {
      return sum + Number(value)
    }, 0)
    return score
  }

  render() {
    return (
      <Box colorIndex="light-1" wrap={true} pad="small" margin="none">
        {this.state.modal.show ? (
          <AnalyticsModal
            title={this.state.modal.title}
            text={this.state.modal.text}
            closer={true}
            onClose={() => this.closeModal()}
          />
        ) : null}
        <Box direction="row" align="center" justify="start">
          <Title>{this.props.analyticsTitle}</Title>
          <CircleInformationIcon
            className="info-button"
            onClick={() => this.changeModalType(this.props.type)}
          />
        </Box>
        <AnnotatedMeter
          type="circle"
          max={this.totalCount(this.props.series)}
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
  series: PropTypes.array,
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.func
}

export default AnalyticsMeter
