import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Box,
  Columns,
  Heading,
  Select,
  FormField,
  AddIcon
} from 'grommet'
// import AddIcon from 'grommet/components/icons/base/Add'

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

  getSpeciesAttr() {
    const {
      quantities,
      scientificNames,
      commonNames,
      descriptions,
      originHashes,
      reExportHashes
    } = this.state
    return [
      quantities,
      scientificNames,
      commonNames,
      descriptions,
      originHashes,
      reExportHashes
    ]
  }

  setSpeciesAttr(attributes) {
    const [
      quantities,
      scientificNames,
      commonNames,
      descriptions,
      originHashes,
      reExportHashes
    ] = attributes
    this.setState({
      quantities,
      scientificNames,
      commonNames,
      descriptions,
      originHashes,
      reExportHashes
    })
  }

  addSpecies() {
    let speciesAttributes = this.getSpeciesAttr()
    speciesAttributes.map(attrArr => {
      if (typeof attrArr[0] === 'number') {
        attrArr.push(0)
      } else {
        attrArr.push('')
      }
    })
    this.setSpeciesAttr(speciesAttributes)
  }

  removeSpecies(index) {
    let speciesAttributes = this.getSpeciesAttr()
    speciesAttributes.map(attrArr => {
      attrArr.splice(index, 1)
    })
    this.setSpeciesAttr(speciesAttributes)
  }

  render() {
    return (
      <Box>
        <Heading align={'center'} margin={'medium'}>
          CITES Permit
        </Heading>
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
        <Box
          justify={'between'}
          size={'full'}
          direction={'row'}
          margin={'medium'}>
          <Heading tag={'h2'}>Specimens</Heading>
          <Button
            label={'Add Species'}
            icon={<AddIcon />}
            onClick={() => this.addSpecies()}
          />
        </Box>
        {this.state.quantities.map((value, index) => (
          <SpeciesInputs
            key={index}
            index={index}
            quantity={this.state.quantities[index]}
            scientificName={this.state.scientificNames[index]}
            commonName={this.state.commonNames[index]}
            description={this.state.descriptions[index]}
            originHash={this.state.originHashes[index]}
            reExportHash={this.state.reExportHashes[index]}
            onChange={(attr, newValue) => {
              this.handleArrayChange(attr, index, newValue)
            }}
            onRemove={index => {
              this.removeSpecies(index)
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
