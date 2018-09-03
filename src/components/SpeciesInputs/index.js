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
  SearchInput,
  Select
} from 'grommet'
import { isASCII } from '../../util/stringUtils'
import local from '../../localization/localizedStrings'
import { SPECIES_SC_NAME_OPTS, SPECIES_COM_NAME_OPTS } from '../../util/options'

/**
 * Component for form elements of species information
 */
class SpeciesInputs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errText: ['', '', '']
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isValid !== this.props.isValid) {
      this.setError(this.props.species.scientificName, 0)
      this.setError(this.props.species.commonName, 1)
      this.setError(this.props.species.description, 2, true)
    }
  }

  setError(value, index, onlyASCII = false) {
    const { isValid } = this.props
    const { errText } = this.state
    let newErrText = ''
    if (!value && !isValid && !onlyASCII) {
      newErrText = 'required'
    } else if (!isASCII(value)) {
      newErrText = 'only ASCII allowed'
    }
    errText[index] = newErrText
    this.setState({ errText })
  }

  getError(value, errText) {
    const { isValid } = this.props
    return isValid === 'initial' ? '' : !value && !isValid && errText
  }

  onNameChange(attr, name) {
    const otherAttr =
      attr === 'scientificName' ? 'commonName' : 'scientificName'
    const otherName = SPECIES_COM_NAME_OPTS.find(s => s[attr] === name)[
      otherAttr
    ]
    this.props.onChange(attr, name)
    this.props.onChange(otherAttr, otherName)
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
    const { errText } = this.state
    return (
      <Box margin={{ bottom: 'large' }}>
        <Box
          justify={'between'}
          size={'full'}
          direction={'row'}
          pad={{ horizontal: 'medium' }}>
          <Heading tag={'h3'}>
            {local.permits.species} {index + 1}
          </Heading>
          {index !== 0 && (
            <Button icon={<SubtractIcon />} onClick={() => onRemove(index)} />
          )}
        </Box>
        <Columns justify={'between'} size={'large'}>
          <FormField label={local.permits.scientificName} error={errText[0]}>
            <Select
              value={species.scientificName}
              options={SPECIES_SC_NAME_OPTS}
              onChange={({ option }) => {
                this.onNameChange('scientificName', option.scientificName)
                this.setError(option.value, 0)
              }}
            />
          </FormField>
          <FormField label={local.permits.commonName} error={errText[1]}>
            <Select
              value={species.commonName}
              options={SPECIES_COM_NAME_OPTS}
              onChange={({ option }) => {
                this.onNameChange('commonName', option.commonName)
                this.setError(option.value, 1)
              }}
            />
          </FormField>
        </Columns>
        <FormField label={local.permits.description} error={errText[2]}>
          <TextInput
            value={species.description}
            onDOMChange={e => {
              onChange('description', e.target.value)
              this.setError(e.target.value, 2, true)
            }}
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
            <FormField
              label={local.permits.originPermitNumber}
              error={this.getError(species.originHash, 'required')}>
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
            <FormField
              label={local.permits.reExportPermitNumber}
              error={this.getError(species.reExportHash, 'required')}>
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
