import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layer, Box, Heading, Label } from 'grommet'

class AnalyticsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { title, text } = this.props
    return (
      <Layer
        closer={true}
        overlayClose={true}
        onClose={() => this.props.onClose()}>
        <Box pad={{ vertical: 'medium' }}>
          <Heading tag={'h2'}>{title}</Heading>
          <Label>{text}</Label>
        </Box>
      </Layer>
    )
  }
}

AnalyticsModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  onClose: PropTypes.func
}

export default AnalyticsModal
