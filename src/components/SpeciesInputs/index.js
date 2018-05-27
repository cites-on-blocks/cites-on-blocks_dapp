import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Box,
  Columns,
  FormField,
  TextInput,
  NumberInput,
  Heading,
  SubtractIcon
} from 'grommet'

/**
 * Component for form elements of species information
 */
class SpeciesInputs extends Component {
  render() {
    const {
      index,
      quantity,
      scientificName,
      commonName,
      description,
      originHash,
      reExportHash,
      onChange,
      onRemove
    } = this.props
    return (
      <Box margin={{ bottom: 'large' }}>
        <Box
          justify={'between'}
          size={'full'}
          direction={'row'}
          pad={{ horizontal: 'medium' }}>
          <Heading tag={'h3'}>Species {index + 1}</Heading>
          {index !== 0 && (
            <Button icon={<SubtractIcon />} onClick={() => onRemove(index)} />
          )}
        </Box>
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
  index: PropTypes.number,
  quantity: PropTypes.number,
  scientificName: PropTypes.string,
  commonName: PropTypes.string,
  description: PropTypes.string,
  originHash: PropTypes.string,
  reExportHash: PropTypes.string,
  onChange: PropTypes.func,
  onRemove: PropTypes.func
}

export default SpeciesInputs
