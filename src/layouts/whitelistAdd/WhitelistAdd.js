import React, { Component } from 'react'
import {
  Box,
  Heading,
  FormField,
  TextInput,
  Select,
  Columns,
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
      txStatus: ''
    }
    this.contracts = context.drizzle.contracts
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
          onBlur={event => {
            this.addAddressToObject(event.target.value, count)
          }}
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
    }
  }

  setCountry(addressCountry) {
    var address = this.state
    address.country = addressCountry.value
    this.setState({ address })
  }

  componentDidMount() {
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
    this.state = {
      addressCount: 0,
      formObject: {},
      addressObject: {},
      country: '',
      modal: {
        show: false,
        text: ''
      },
      txStatus: ''
    }
    //window.location.reload() //Stupid
  }

  removeAddressField(id) {
    delete this.state.formObject[id]
    delete this.state.addressObject[id]
  }

  render() {
    var keys = Object.keys(this.state.formObject)
    var addressFields = []
    for (var i = 0; i !== keys.length; i++) {
      addressFields.push(this.state.formObject[keys[i]])
    }
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
          disabled={true} //this.forbiddenArrayState(this.state.addressesToAdd)
          primary={true}
          label={'Add Addresses to Whitelist'}
          icon={<DocumentUploadIcon />}
          onClick={() => this.addAddresses()}
        />
      </Box>
    )
  }
}

WhitelistAdd.propTypes = {
  accounts: PropTypes.object,
  drizzleStatus: PropTypes.object,
  contracts: PropTypes.object,
  transactionStack: PropTypes.array,
  transactions: PropTypes.object,
  history: PropTypes.object
}

WhitelistAdd.contextTypes = {
  drizzle: PropTypes.object
}

export default WhitelistAdd
