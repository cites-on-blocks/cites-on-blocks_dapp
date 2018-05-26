import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Columns, Heading, Select, FormField, Label } from 'grommet'

import AddressInputs from '../../components/AddressInputs'

import * as options from '../../util/options'
import SpeciesInputs from '../../components/SpeciesInputs'

class Permits extends Component {
  constructor() {
    super()
    this.state = {
      permitForm: options.permitForms[0],
      exportCountry: '',
      importCountry: '',
      permitType: options.permitTypes[0],
      importer: ['', '', ''],
      exporter: ['', '', ''],
      quantities: [0],
      scientificNames: [''],
      commonNames: [''],
      descriptions: [''],
      originHashes: [''],
      reExportHashes: ['']
    }
  }

  handleChange(attr, newValue) {
    const newState = {}
    newState[attr] = newValue
    this.setState(newState)
  }

  handleFormChange(newValue) {
    this.handleChange('permitForm', newValue)
    // TODO prefill export or import country
  }

  handleArrayChange(attr, index, newValue) {
    const newArr = this.state[attr]
    newArr[index] = newValue
    this.handleChange(attr, newArr)
  }

  render() {
    return (
      <Box>
        <Heading>Permit</Heading>
        <Columns justify={'between'} size={'large'}>
          <FormField label={'Type'}>
            <Select
              value={this.state.permitForm}
              options={options.permitForms}
              onChange={({ option }) => {
                this.handleFormChange(option)
              }}
            />
          </FormField>
          <FormField label={'Permit type'}>
            <Select
              value={this.state.permitType}
              options={options.permitTypes}
              onChange={({ option }) => {
                this.handleChange('permitType', option)
              }}
            />
          </FormField>
        </Columns>
        <Columns justify={'between'} size={'large'}>
          <FormField label={'Country of export'}>
            <Select
              value={this.state.exportCountry}
              options={options.countries}
              onChange={({ option }) => {
                this.handleChange('exportCountry', option.value)
              }}
            />
          </FormField>
          <FormField label={'Country of import'}>
            <Select
              value={this.state.importCountry}
              options={options.countries}
              onChange={({ option }) => {
                this.handleChange('importCountry', option.value)
              }}
            />
          </FormField>
        </Columns>
        <Columns justify={'between'} size={'large'}>
          <AddressInputs
            address={this.state.exporter}
            recipient={'exporter'}
            onChange={(recipient, index, newValue) => {
              this.handleArrayChange(recipient, index, newValue)
            }}
          />
          <AddressInputs
            address={this.state.importer}
            recipient={'importer'}
            onChange={(recipient, index, newValue) => {
              this.handleArrayChange(recipient, index, newValue)
            }}
          />
        </Columns>
        <Columns>
          <Label>Specimens</Label>
        </Columns>
        {this.state.quantities.map((value, index) => (
          <SpeciesInputs
            key={index}
            quantity={this.state.quantities[index]}
            scientificName={this.state.scientificNames[index]}
            commonName={this.state.commonNames[index]}
            description={this.state.descriptions[index]}
            originHash={this.state.originHashes[index]}
            reExportHash={this.state.reExportHashes[index]}
            onChange={(attr, newValue) => {
              this.handleArrayChange(attr, index, newValue)
            }}
          />
        ))}
      </Box>
    )
  }
}

Permits.propTypes = {
  accounts: PropTypes.object
}

export default Permits
