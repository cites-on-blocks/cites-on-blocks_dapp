import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, FormField, TextInput } from 'grommet'
import { isASCII } from '../../util/stringUtils'
import local from '../../localization/localizedStrings'

/**
 * Component for form elements of addresses of exporter / importer
 */
class AddressInputs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errText: ['', '', '']
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isValid !== this.props.isValid) {
      this.setError(this.props.address[0], 0)
      this.setError(this.props.address[1], 1)
      this.setError(this.props.address[2], 2)
    }
  }

  setError(value, index) {
    const { isValid } = this.props
    const { errText } = this.state
    let newErrText = ''
    if (!value && !isValid) {
      newErrText = 'required'
    } else if (!isASCII(value)) {
      newErrText = 'only ASCII allowed'
    }
    errText[index] = newErrText
    this.setState({ errText })
  }

  getLabel(recipient, label) {
    return recipient === 'exporter'
      ? local.permits[`ex${label}`]
      : local.permits[`im${label}`]
  }

  render() {
    const { recipient, address, onChange } = this.props
    const { errText } = this.state
    return (
      <Box justify={'between'} size={'large'}>
        <FormField label={this.getLabel(recipient, 'Name')} error={errText[0]}>
          <TextInput
            id={`${recipient}Name`}
            value={address[0]}
            onDOMChange={e => {
              onChange(recipient, 0, e.target.value)
              this.setError(address[0], 0)
            }}
          />
        </FormField>
        <FormField
          label={this.getLabel(recipient, 'Street')}
          error={errText[1]}>
          <TextInput
            id={`${recipient}Street`}
            value={address[1]}
            onDOMChange={e => {
              onChange(recipient, 1, e.target.value)
              this.setError(address[1], 1)
            }}
          />
        </FormField>
        <FormField label={this.getLabel(recipient, 'City')} error={errText[2]}>
          <TextInput
            id={`${recipient}City`}
            value={address[2]}
            onDOMChange={e => {
              onChange(recipient, 2, e.target.value)
              this.setError(address[2], 2)
            }}
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
