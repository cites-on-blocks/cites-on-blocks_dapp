import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layer, Box, Heading, StatusIcon } from 'grommet'

/**
 * Component for form elements of addresses of exporter / importer
 */
class PendingTxModal extends Component {
  getStatusValue(txStatus) {
    if (txStatus === 'success') {
      return 'ok'
    }
    if (txStatus === 'failed') {
      return 'critical'
    }
    return 'unknown'
  }

  render() {
    const {
      txStatus,
      text,
      onPendingActions,
      onSuccessActions,
      onFailActions
    } = this.props
    const statusValue = this.getStatusValue(txStatus)
    return (
      <Layer>
        <Box pad={{ vertical: 'medium' }}>
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            <StatusIcon size={'large'} value={statusValue} />
          </Box>
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            <Heading tag={'h2'}>{text}</Heading>
          </Box>
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            {txStatus === 'pending' && onPendingActions}
            {txStatus === 'success' && onSuccessActions}
            {txStatus === 'failed' && onFailActions}
          </Box>
        </Box>
      </Layer>
    )
  }
}

PendingTxModal.propTypes = {
  txStatus: PropTypes.string, // 'pending', 'success' or 'failed'
  text: PropTypes.string,
  onPendingActions: PropTypes.any,
  onSuccessActions: PropTypes.any,
  onFailActions: PropTypes.any
}

export default PendingTxModal
