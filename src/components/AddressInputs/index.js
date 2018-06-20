import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, FormField, TextInput } from 'grommet'
import local from '../../localization/localizedStrings'

/**
 * Component for form elements of addresses of exporter / importer
 */
class AddressInputs extends Component {
  getError(value, errText) {
    const { isValid } = this.props
    return isValid === 'initial' ? '' : !value && !isValid && errText
  }

  getLabel(recipient, label) {
    return recipient === 'exporter'
      ? local.permits[`ex${label}`]
      : local.permits[`im${label}`]
  }

  render() {
    const { recipient, address, onChange } = this.props
    return (
      <Box justify={'between'} size={'large'}>
        <FormField
          label={this.getLabel(recipient, 'Name')}
          error={this.getError(address[0], 'required')}>
          <TextInput
            id={`${recipient}Name`}
            value={address[0]}
            onDOMChange={e => onChange(recipient, 0, e.target.value)}
          />
        </FormField>
        <FormField
          label={this.getLabel(recipient, 'Street')}
          error={this.getError(address[1], 'required')}>
          <TextInput
            id={`${recipient}Street`}
            value={address[1]}
            onDOMChange={e => onChange(recipient, 1, e.target.value)}
          />
        </FormField>
        <FormField
          label={this.getLabel(recipient, 'City')}
          error={this.getError(address[2], 'required')}>
          <TextInput
            id={`${recipient}City`}
            value={address[2]}
            onDOMChange={e => onChange(recipient, 2, e.target.value)}
          />
        </FormField>
      </Box>
    )
  }
}

AddressInputs.propTypes = {
  recipient: PropTypes.string, // either 'importer' or 'exporter'
  address: PropTypes.array, // address array -> [name, street, city]
  onChange: PropTypes.func,
  isValid: PropTypes.any
}

export default AddressInputs
