import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Columns, Heading, Select, FormField, TextInput } from 'grommet'

import * as options from '../../util/options'

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
      quanities: [],
      scientificNames: [],
      commonNames: [],
      descriptions: [],
      originHashes: [],
      reExportHashes: []
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

  handleArrChange(attr, index, newValue) {
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
          <Columns justify={'between'} size={'large'}>
            <FormField label={'Exporter name'}>
              <TextInput
                id={'exName'}
                name={'ex-name'}
                value={this.state.exporter[0]}
                onDOMChange={e => {
                  this.handleArrChange('exporter', 0, e.target.value)
                }}
              />
            </FormField>
            <FormField label={'Exporter street'}>
              <TextInput
                id={'exStreet'}
                name={'ex-street'}
                value={this.state.exporter[1]}
                onDOMChange={e => {
                  this.handleArrChange('exporter', 1, e.target.value)
                }}
              />
            </FormField>
            <FormField label={'Exporter city'}>
              <TextInput
                id={'exCity'}
                name={'ex-city'}
                value={this.state.exporter[2]}
                onDOMChange={e => {
                  this.handleArrChange('exporter', 2, e.target.value)
                }}
              />
            </FormField>
          </Columns>
          <Columns justify={'between'} size={'large'}>
            <FormField label={'Importer name'}>
              <TextInput
                id={'imName'}
                name={'im-name'}
                value={this.state.importer[0]}
                onDOMChange={e => {
                  this.handleArrChange('importer', 0, e.target.value)
                }}
              />
            </FormField>
            <FormField label={'Importer street'}>
              <TextInput
                id={'imStreet'}
                name={'im-street'}
                value={this.state.importer[1]}
                onDOMChange={e => {
                  this.handleArrChange('importer', 1, e.target.value)
                }}
              />
            </FormField>
            <FormField label={'Importer city'}>
              <TextInput
                id={'imCity'}
                name={'im-city'}
                value={this.state.importer[2]}
                onDOMChange={e => {
                  this.handleArrChange('importer', 2, e.target.value)
                }}
              />
            </FormField>
          </Columns>
        </Columns>
      </Box>
    )
  }
}

Permits.propTypes = {
  accounts: PropTypes.object
}

export default Permits
