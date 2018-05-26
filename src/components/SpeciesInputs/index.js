import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Columns, FormField, TextInput, NumberInput } from 'grommet'

/**
 * Component for form elements of species information
 */
class SpeciesInputs extends Component {
  render() {
    const {
      quantity,
      scientificName,
      commonName,
      description,
      originHash,
      reExportHash,
      onChange
    } = this.props
    return (
      <Box>
        <Columns justify={'between'} size={'large'}>
          <FormField label={'Scientific name'}>
            <TextInput
              value={scientificName}
              onDOMChange={e => onChange('scientificNames', e.target.value)}
            />
          </FormField>
          <FormField label={'Common name'}>
            <TextInput
              value={commonName}
              onDOMChange={e => onChange('commonNames', e.target.value)}
            />
          </FormField>
        </Columns>
        <FormField label={'Description'}>
          <TextInput
            value={description}
            onDOMChange={e => onChange('descriptions', e.target.value)}
          />
        </FormField>
        <FormField label={'Quantity'}>
          <NumberInput
            value={quantity}
            step={1}
            min={0}
            onChange={e => onChange('quantities', e.target.value)}
          />
        </FormField>
        <FormField label={'Number of origin permit'}>
          <TextInput
            value={originHash}
            onDOMChange={e => onChange('originHashes', e.target.value)}
          />
        </FormField>
        <FormField label={'Number of last re-export permit'}>
          <TextInput
            value={reExportHash}
            onDOMChange={e => onChange('reExportHashes', e.target.value)}
          />
        </FormField>
      </Box>
    )
  }
}

SpeciesInputs.propTypes = {
  quantity: PropTypes.number,
  scientificName: PropTypes.string,
  commonName: PropTypes.string,
  description: PropTypes.string,
  originHash: PropTypes.string,
  reExportHash: PropTypes.string,
  onChange: PropTypes.func
}

export default SpeciesInputs
