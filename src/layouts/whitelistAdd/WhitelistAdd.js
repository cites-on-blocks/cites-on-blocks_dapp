import React, { Component } from 'react'
import {
  Box,
  Heading,
  FormField,
  TextInput,
  Select,
  Columns,
  Paragraph,
  Button,
  CloseIcon,
  AddIcon,
  DocumentUploadIcon
} from 'grommet'
import { utils } from 'web3'
import PropTypes from 'prop-types'

import * as options from '../../util/options'
import PendingTxModal from '../../components/PendingTxModal'

class WhitelistAdd extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      addressCount: 0,
      formObject: {},
      addressObject: {},
      country: '',
      modal: {
        show: false,
        text: ''
      },
      valid: true,
      txStatus: '',
      isOwner: false
    }
    this.contracts = context.drizzle.contracts
    this.dataKeyOwner = this.contracts.Whitelist.methods.owner.cacheCall()
    console.log(this.props.isOwner)
  }
  checkOwner() {
    if (this.dataKeyOwner in this.props.Whitelist.owner) {
      if (
        this.props.accounts[0] ===
        this.props.Whitelist.owner[this.dataKeyOwner].value
      ) {
        this.setState({ isOwner: true })
      } else {
        this.setState({ isOwner: false })
      }
    }
    console.log(this.state.isOwner)
  }
  //find a better fitting name
  addAddressField() {
    this.createAddressFields(this.state.addressCount++)
  }
  //find a better fitting name as well
  createAddressFields(count) {
    var fields = this.state.formObject
    fields[count] = (
      <FormField label={'Address'} key={count} id={count + ''}>
        <TextInput
          onBlur={event => this.addAddressToObject(event.target.value, count)}
        />
        <CloseIcon onClick={() => this.removeAddressField(count)} />
      </FormField>
    )
  }

  addAddressToObject(address, index) {
    var addresses = this.state.addressObject
    addresses[index] = address
  }

  getAddressObjectPropsAsArray() {
    var addresses = []
    var keys = Object.keys(this.state.addressObject)
    var addrObject = this.state.addressObject
    for (var i = 0; i !== keys.length; i++) {
      addresses.push(addrObject[keys[i]])
    }
    return addresses
  }

  addAddresses() {
    var addressesToAdd = this.getAddressObjectPropsAsArray()
    console.log(addressesToAdd)
    console.log(this.state.country)
    if (
      addressesToAdd.every(ad => utils.isAddress(ad)) &&
      this.state.country !== ''
    ) {
      this.stackId = this.contracts.Whitelist.methods.addAddresses.cacheSend(
        addressesToAdd,
        utils.asciiToHex(this.state.country),
        { from: this.props.accounts[0] }
      )
    } else {
      var add = this.state
      add.valid = false
      this.setState({ add })
    }
  }

  setCountry(addressCountry) {
    var address = this.state
    address.country = addressCountry.value
    this.setState({ address })
  }

  componentDidMount() {
    this.checkOwner()
    this.addAddressField()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.transactionStack[this.stackId]) {
      const txHash = this.props.transactionStack[this.stackId]
      const { status } = this.props.transactions[txHash]
      // change tx related state is status changed
      if (prevState.txStatus !== status) {
        this.changeTxState(status)
      }
    }
  }

  changeTxState(newTxState) {
    if (newTxState === 'pending') {
      this.setState({
        txStatus: 'pending',
        modal: {
          show: true,
          text: 'Adding addresses pending...'
        }
      })
    } else if (newTxState === 'success') {
      this.stackId = ''
      this.setState({
        txStatus: 'success',
        modal: {
          show: true,
          text: 'Successfully added addresses!'
        }
      })
    } else {
      this.stackId = ''
      this.setState({
        txStatus: 'failed',
        modal: {
          show: true,
          text: 'Adding addresses has failed.'
        }
      })
    }
  }

  clearForm() {
    window.location.reload() //Stupid
  }

  removeAddressField(id) {
    delete this.state.formObject[id]
    delete this.state.addressObject[id]
  }

  allInputIsValid() {
    var keys = Object.keys(this.state.addressObject)
    var asArray = this.getAddressObjectPropsAsArray()

    var isCountry = this.state.country !== ''
    var isNotEmpty1 = keys.length !== 0
    var isNotEmpty2 = this.state.addressObject.constructor === Object
    var asArrayIsNotEmpty = asArray.length >= 1
    var allAddresses = asArray.every(ad => utils.isAddress(ad))

    return (
      isCountry &&
      isNotEmpty1 &&
      isNotEmpty2 &&
      asArrayIsNotEmpty &&
      allAddresses
    )
  }

  render() {
    var keys = Object.keys(this.state.formObject)
    var addressFields = []
    for (var i = 0; i !== keys.length; i++) {
      addressFields.push(this.state.formObject[keys[i]])
    }
    var error = ''
    if (!this.state.valid) {
      error = (
        <Paragraph style={{ color: 'red' }}>
          Invalid input. Make sure all addresses are valid Ethereum addresses
          and that you have selected a country
        </Paragraph>
      )
    }
    console.log(this.state.isOwner)
    if (this.state.isOwner) {
      return (
        <Box>
          {this.state.modal.show && (
            <PendingTxModal
              txStatus={this.state.txStatus}
              text={this.state.modal.text}
              onSuccessActions={
                <Columns justify={'between'} size={'small'}>
                  <Button
                    label={'Add more addresses'}
                    onClick={() => this.clearForm()}
                  />
                  <Button label={'Go to whitelist'} path={'/whitelist'} />
                </Columns>
              }
              onFailActions={
                <Columns justify={'between'} size={'small'}>
                  <Button
                    label={'Add new addresses'}
                    onClick={() => this.clearForm()}
                  />
                  <Button
                    label={'Try again'}
                    onClick={() => this.addAddresses()}
                  />
                </Columns>
              }
            />
          )}
          <Heading align={'center'} margin={'medium'}>
            Whitelisting
          </Heading>
          <FormField label={'Country'}>
            <Select
              id={'select'}
              options={options.countries}
              value={this.state.country}
              onChange={option => {
                this.setCountry(option.value)
              }}
            />
          </FormField>
          {addressFields}
          <Button
            label={'Add more Addresses'}
            icon={<AddIcon />}
            onClick={() => this.addAddressField()}
          />
          <Button
            primary={true}
            label={'Add Addresses to Whitelist'}
            icon={<DocumentUploadIcon />}
            onClick={() => this.addAddresses()}
          />
          {error}
        </Box>
      )
    } else {
      return (
        <Paragraph style={{ color: 'red' }}>
          Adding addresses to the Whitelist is only possible when logged in as
          an Owner
        </Paragraph>
      )
    }
  }
}

WhitelistAdd.propTypes = {
  accounts: PropTypes.object,
  drizzleStatus: PropTypes.object,
  contracts: PropTypes.object,
  transactionStack: PropTypes.array,
  transactions: PropTypes.object,
  history: PropTypes.object,
  dataKeyAddresses: PropTypes.string,
  isOwner: PropTypes.bool,
  Whitelist: PropTypes.object
}

WhitelistAdd.contextTypes = {
  drizzle: PropTypes.object
}

export default WhitelistAdd
