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
  SubtractIcon,
  SearchInput
} from 'grommet'

import local from '../../localization/localizedStrings'

/**
 * Component for form elements of species information
 */
class SpeciesInputs extends Component {
  getError(value, errText) {
    const { isValid } = this.props
    return isValid === 'initial' ? '' : !value && !isValid && errText
  }

  render() {
    const {
      index,
      species,
      onChange,
      onRemove,
      hashSuggestions,
      permitType
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
          <FormField
            label={local.permits.scientificName}
            error={this.getError(species.scientificName, 'required')}>
            <TextInput
              value={species.scientificName}
              onDOMChange={e => onChange('scientificName', e.target.value)}
            />
          </FormField>
          <FormField
            label={local.permits.commonName}
            error={this.getError(species.commonName, 'required')}>
            <TextInput
              value={species.commonName}
              onDOMChange={e => onChange('commonName', e.target.value)}
            />
          </FormField>
        </Columns>
        <FormField label={local.permits.description}>
          <TextInput
            value={species.description}
            onDOMChange={e => onChange('description', e.target.value)}
          />
        </FormField>
        <FormField
          label={local.permits.quantity}
          error={this.getError(species.quantity, 'required')}>
          <NumberInput
            value={species.quantity}
            step={1}
            min={0}
            onChange={e => onChange('quantity', e.target.value)}
          />
        </FormField>
        {permitType === 'RE-EXPORT' && (
          <div>
            <FormField label={local.permits.originPermitNumber}>
              <SearchInput
                placeHolder={local.permits.originHashPlaceholder}
                inline={true}
                responsive={false}
                suggestions={hashSuggestions}
                value={species.originHash}
                onSelect={({ suggestion }) =>
                  onChange('originHash', suggestion)
                }
                onDOMChange={e => onChange('originHash', e.target.value)}
              />
            </FormField>
            <FormField label={local.permits.reExportPermitNumber}>
              <SearchInput
                placeHolder={local.permits.reExportPlaceholder}
                inline={true}
                responsive={false}
                suggestions={hashSuggestions}
                value={species.reExportHash}
                onSelect={({ suggestion }) =>
                  onChange('reExportHash', suggestion)
                }
                onDOMChange={e => onChange('reExportHash', e.target.value)}
              />
            </FormField>
          </div>
        )}
      </Box>
    )
  }
}

SpeciesInputs.propTypes = {
  index: PropTypes.number,
  species: PropTypes.object,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  isValid: PropTypes.any,
  hashSuggestions: PropTypes.array,
  permitType: PropTypes.string
}

export default SpeciesInputs
