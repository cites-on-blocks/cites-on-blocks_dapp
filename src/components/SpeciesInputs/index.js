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
    const { index, species, onChange, onRemove } = this.props
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
              value={species.scientificName}
              onDOMChange={e => onChange('scientificName', e.target.value)}
            />
          </FormField>
          <FormField label={'Common name'}>
            <TextInput
              value={species.commonName}
              onDOMChange={e => onChange('commonName', e.target.value)}
            />
          </FormField>
        </Columns>
        <FormField label={'Description'}>
          <TextInput
            value={species.description}
            onDOMChange={e => onChange('description', e.target.value)}
          />
        </FormField>
        <FormField label={'Quantity'}>
          <NumberInput
            value={species.quantity}
            step={1}
            min={0}
            onChange={e => onChange('quantity', e.target.value)}
          />
        </FormField>
        <FormField label={'Number of origin permit'}>
          <TextInput
            value={species.originHash}
            onDOMChange={e => onChange('originHash', e.target.value)}
          />
        </FormField>
        <FormField label={'Number of last re-export permit'}>
          <TextInput
            value={species.reExportHash}
            onDOMChange={e => onChange('reExportHash', e.target.value)}
          />
        </FormField>
      </Box>
    )
  }
}

SpeciesInputs.propTypes = {
  index: PropTypes.number,
  species: PropTypes.object,
  onChange: PropTypes.func,
  onRemove: PropTypes.func
}

export default SpeciesInputs
