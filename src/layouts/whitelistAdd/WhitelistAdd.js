import React, { Component } from 'react'
import {
  Box,
  Heading,
  FormField,
  TextInput,
  Select,
  Button,
  AddIcon
} from 'grommet'
//import { utils } from 'web3'
import PropTypes from 'prop-types'

import * as options from '../../util/options'

class WhitelistAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addressCount: 1,
      addressFieldArray: [0],
      addressesToAdd: []
    }
  }
  addAddressField() {
    console.log(this.state.addressCount)
    this.createAddressFields(this.state.addressCount++)
  }

  createAddressFields(count) {
    this.state.addressFieldArray.push(count)
    console.log(this.state.addressFieldArray)
  }

  addAddressToArray(address, index) {
    var addresses = this.state.addressesToAdd
    addresses[index] = address

    this.state = {
      addressesToAdd: addresses
    }
  }

  addAddresses() {
    console.log(this.state.addressesToAdd)
  }

  render() {
    var addressFields = this.state.addressFieldArray.map(field => {
      return (
        <FormField label={'Address' + field} key={field}>
          <TextInput
            onBlur={event => {
              this.addAddressToArray(event.target.value, field)
            }}
          />
        </FormField>
      )
    })
    return (
      <Box>
        <Heading align={'center'} margin={'medium'}>
          Whitelisting
        </Heading>
        <FormField label={'Country'}>
          <Select options={options.countries} />
        </FormField>
        {addressFields}
        <Button
          label={'Add more Addresses'}
          icon={<AddIcon />}
          onClick={() => this.addAddressField()}
        />
        <Button
          label={'Add Addresses to Whitelist'}
          icon={<AddIcon />}
          onClick={() => this.addAddresses()}
        />
      </Box>
    )
  }
}

WhitelistAdd.propTypes = {
  addressCount: PropTypes.number,
  addressFieldArray: PropTypes.array,
  addressesToAdd: PropTypes.array
}

export default WhitelistAdd
