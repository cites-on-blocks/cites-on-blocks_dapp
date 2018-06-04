import React, { Component } from 'react'
import {
  Box,
  Heading,
  FormField,
  TextInput,
  Select,
  Columns,
  Button,
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
      addressCount: 1,
      addressFieldArray: [0],
      addressesToAdd: [],
      country: '',
      modal: {
        show: false,
        text: ''
      },
      txStatus: ''
    }
    this.contracts = context.drizzle.contracts
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
    console.log(this.state.country)
    if (this.state.addressesToAdd.every(ad => utils.isAddress(ad))) {
      this.stackId = this.contracts.Whitelist.methods.addAddresses.cacheSend(
        this.state.addressesToAdd,
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
    this.setState({
      addressCount: 1,
      addressFieldArray: [0],
      addressesToAdd: [],
      country: '',
      modal: {
        show: false,
        text: ''
      },
      txStatus: ''
    })
    window.location.reload() //Stupid
  }

  render() {
    var addressFields = this.state.addressFieldArray.map(field => {
      return (
        <FormField label={'Address'} key={field}>
          <TextInput
            id={field + ''}
            onBlur={event => {
              this.addAddressToArray(event.target.value, field)
            }}
          />
        </FormField>
      )
    })
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
