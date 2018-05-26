import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Columns, FormField, TextInput } from 'grommet'

/**
 * Component for form elements of addresses of exporter / importer
 */
class AddressInputs extends Component {
  render() {
    const { recipient, address, onChange } = this.props
    return (
      <Columns justify={'between'} size={'large'}>
        <FormField label={`Name of ${recipient}`}>
          <TextInput
            id={`${recipient}Name`}
            value={address[0]}
            onDOMChange={e => onChange(recipient, 0, e.target.value)}
          />
        </FormField>
        <FormField label={`Street of ${recipient}`}>
          <TextInput
            id={`${recipient}Street`}
            value={address[1]}
            onDOMChange={e => onChange(recipient, 1, e.target.value)}
          />
        </FormField>
        <FormField label={`City of ${recipient}`}>
          <TextInput
            id={`${recipient}City`}
            value={address[2]}
            onDOMChange={e => onChange(recipient, 2, e.target.value)}
          />
        </FormField>
      </Columns>
    )
  }
}

AddressInputs.propTypes = {
  recipient: PropTypes.string, // either 'importer' or 'exporter'
  address: PropTypes.array, // address array -> [name, street, city]
  onChange: PropTypes.func
}

export default AddressInputs
