import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Box,
  Columns,
  Heading,
  Select,
  FormField,
  AddIcon,
  DocumentUploadIcon
} from 'grommet'
import Web3, { utils } from 'web3'

import AddressInputs from '../../components/AddressInputs'
import SpeciesInputs from '../../components/SpeciesInputs'
import PendingTxModal from '../../components/PendingTxModal'
import * as permitUtils from '../../util/permitUtils'
import local from '../../localization/localizedStrings'

// NOTE: to be replaced with proper country list from whitelist ui branch
const COUNTRIES = [
  {
    value: 'DE',
    label: 'DE'
  },
  {
    value: 'FR',
    label: 'FR'
  },
  {
    value: 'EN',
    label: 'EN'
  },
  {
    value: 'US',
    label: 'US'
  }
]

class PermitCreate extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      permitForm: permitUtils.PERMIT_FORMS[0],
      permit: permitUtils.DEFAULT_PERMIT,
      specimens: [permitUtils.DEFAULT_SPECIMEN],
      // authority information
      authorityCountry: '',
      // tx information modal
      modal: {
        show: false,
        text: ''
      },
      // tx status
      txStatus: '',
      // used for form validation
      isValid: 'initial',
      hashSuggestions: []
    }
    // for convinience
    this.contracts = context.drizzle.contracts
    // NOTE: We have to iniate a new web3 instance for retrieving event via `getPastEvents`.
    //       MetaMask does not support websockets and Drizzle retrieves events via subscriptions.
    const web3 = new Web3(this.contracts.PermitFactory.givenProvider)
    const { abi, address } = this.contracts.PermitFactory
    this.PermitFactory = new web3.eth.Contract(abi, address)
    this.setAuthToCountryKey()
  }

  async componentDidMount() {
    this.handleFormChange(this.state.permitForm)
    const events = await permitUtils.getPermitEvents(
      this.PermitFactory,
      'PermitCreated'
    )
    const permitHashes = events.map(e => e.permitHash)
    this.setState({ hashSuggestions: permitHashes })
  }

  componentDidUpdate(prevProps, prevState) {
    // check if accounts changed
    if (this.props.accounts[0] !== prevProps.accounts[0]) {
      this.setAuthToCountryKey()
      this.handleFormChange(this.state.permitForm)
    }
    // check if key is cached
    if (this.authToCountryKey in this.props.PermitFactory.authorityToCountry) {
      const authorityCountry = utils.hexToUtf8(
        this.props.PermitFactory.authorityToCountry[this.authToCountryKey].value
      )
      // only set state if authority country changed
      if (prevState.authorityCountry !== authorityCountry) {
        this.setState({ authorityCountry })
        this.handleFormChange(this.state.permitForm)
      }
    }
    // check if tx for stack id exists
    if (this.props.transactionStack[this.stackId]) {
      const txHash = this.props.transactionStack[this.stackId]
      const { status } = this.props.transactions[txHash]
      // change tx related state is status changed
      if (prevState.txStatus !== status) {
        this.changeTxState(status)
      }
    }
  }

  /**
   * DRIZZLE HANDLERS
   */

  setAuthToCountryKey() {
    // return key for data and cache result in PermitFatory prop
    this.authToCountryKey = this.contracts.PermitFactory.methods.authorityToCountry.cacheCall(
      this.props.accounts[0]
    )
  }

  createPermit() {
    const isValid = this.isFormValid()
    this.setState({ isValid })
    if (isValid) {
      const { permit, specimens } = this.state
      const specimensAsArrays = permitUtils.convertSpecimensToArrays(specimens)
      // stack id used for monitoring transaction
      this.stackId = this.contracts.PermitFactory.methods.createPermit.cacheSend(
        utils.asciiToHex(permit.exportCountry),
        utils.asciiToHex(permit.importCountry),
        permitUtils.PERMIT_TYPES.indexOf(permit.permitType),
        permit.exporter.map(address => utils.asciiToHex(address)),
        permit.importer.map(address => utils.asciiToHex(address)),
        specimensAsArrays.quantities,
        specimensAsArrays.scientificNames.map(e => utils.asciiToHex(e)),
        specimensAsArrays.commonNames.map(e => utils.asciiToHex(e)),
        specimensAsArrays.descriptions.map(e => utils.asciiToHex(e)),
        specimensAsArrays.originHashes.map(
          hash => (hash ? hash : utils.asciiToHex(hash))
        ),
        specimensAsArrays.reExportHashes.map(
          hash => (hash ? hash : utils.asciiToHex(hash))
        ),
        { from: this.props.accounts[0] }
      )
    }
  }

  changeTxState(newTxState) {
    if (newTxState === 'pending') {
      this.setState({
        txStatus: 'pending',
        modal: {
          show: true,
          text: 'Permit creation pending...'
        }
      })
    } else if (newTxState === 'success') {
      this.stackId = ''
      this.setState({
        txStatus: 'success',
        modal: {
          show: true,
          text: 'Permit creation successful!'
        }
      })
    } else {
      this.stackId = ''
      this.setState({
        txStatus: 'failed',
        modal: {
          show: true,
          text: 'Permit creation has failed.'
        }
      })
    }
  }

  /**
   * UI ONLY HANDLERS
   */

  handleFormChange(permitForm) {
    const { permit, authorityCountry } = this.state
    if (permitForm === 'DIGITAL') {
      permit.exportCountry = authorityCountry
      permit.importCountry = ''
    } else {
      permit.importCountry = authorityCountry
      permit.exportCountry = ''
    }
    this.setState({ permitForm, permit })
  }

  handlePermitChange(attribute, newValue) {
    const { permit } = this.state
    permit[attribute] = newValue
    this.setState({ permit })
  }

  handleAddressChange(index, recipient, newValue) {
    const newAddress = this.state.permit[recipient]
    newAddress[index] = newValue
    this.handlePermitChange(recipient, newAddress)
  }

  handleSpeciesChange(index, attribute, newValue) {
    const { specimens } = this.state
    const newSpecies = { ...specimens[index] }
    newSpecies[attribute] = newValue
    specimens[index] = newSpecies
    this.setState({ specimens })
  }

  addSpecies() {
    const { specimens } = this.state
    specimens.push(permitUtils.DEFAULT_SPECIMEN)
    this.setState({ specimens })
  }

  removeSpecies(index) {
    const { specimens } = this.state
    specimens.splice(index, 1)
    this.setState({ specimens })
  }

  clearForm() {
    this.setState({
      permit: permitUtils.DEFAULT_PERMIT,
      specimens: [permitUtils.DEFAULT_SPECIMEN],
      txStatus: '',
      modal: {
        show: false,
        text: ''
      }
    })
  }

  isFormValid() {
    const { permit, specimens } = this.state
    const permitValid =
      permit.exportCountry &&
      permit.importCountry &&
      permit.permitType &&
      permit.importer &&
      permit.exporter
    const specimensValid = specimens.reduce((isValid, specimen) => {
      let validHashes
      const {
        quantity,
        scientificName,
        commonName,
        originHash,
        reExportHash
      } = specimen
      if (permit.permitType === 'RE-EXPORT') {
        validHashes =
          permitUtils.isValidPermitHash(originHash) &&
          permitUtils.isValidPermitHash(reExportHash)
      } else {
        validHashes = true
      }
      return (
        isValid && quantity > 0 && scientificName && commonName && validHashes
      )
    }, true)
    return permitValid && specimensValid
  }

  getError(value, errText) {
    const { isValid } = this.state
    return isValid === 'initial' ? '' : !value && !isValid && errText
  }

  render() {
    const {
      permitForm,
      permit,
      specimens,
      isValid,
      hashSuggestions,
      authorityCountry
    } = this.state
    return (
      <Box>
        {this.state.modal.show && (
          <PendingTxModal
            txStatus={this.state.txStatus}
            text={this.state.modal.text}
            onSuccessActions={
              <Columns justify={'between'} size={'small'}>
                <Button label={'New permit'} onClick={() => this.clearForm()} />
                <Button label={'Go to permit'} path={'/permits'} />
              </Columns>
            }
            onFailActions={
              <Columns justify={'between'} size={'small'}>
                <Button label={'New permit'} onClick={() => this.clearForm()} />
                <Button label={'Try again'} onClick={() => this.addSpecies()} />
              </Columns>
            }
          />
        )}
        <Heading align={'center'} margin={'medium'}>
          CITES {local.permits.permit}
        </Heading>
        <Columns justify={'between'} size={'large'}>
          <FormField label={local.permits.type}>
            <Select
              value={permitForm}
              options={permitUtils.PERMIT_FORMS}
              onChange={({ option }) => {
                this.handleFormChange(option)
              }}
            />
          </FormField>
          <FormField label={local.permits.permitType}>
            <Select
              value={permit.permitType}
              options={permitUtils.PERMIT_TYPES}
              onChange={({ option }) => {
                this.handlePermitChange('permitType', option)
              }}
            />
          </FormField>
        </Columns>
        <Columns justify={'between'} size={'large'}>
          <FormField
            label={local.permits.countryOfExport}
            error={this.getError(permit.exportCountry, 'required')}>
            <Select
              value={permit.exportCountry}
              options={
                permitForm === 'DIGITAL'
                  ? [{ value: authorityCountry, label: authorityCountry }]
                  : COUNTRIES.filter(c => c.value !== permit.importCountry)
              }
              onChange={({ option }) => {
                this.handlePermitChange('exportCountry', option.value)
              }}
            />
          </FormField>
          <FormField
            label={local.permits.countryOfImport}
            error={this.getError(permit.importCountry, 'required')}>
            <Select
              value={permit.importCountry}
              options={
                permitForm === 'PAPER'
                  ? [{ value: authorityCountry, label: authorityCountry }]
                  : COUNTRIES.filter(c => c.value !== permit.exportCountry)
              }
              onChange={({ option }) => {
                this.handlePermitChange('importCountry', option.value)
              }}
            />
          </FormField>
        </Columns>
        <Columns justify={'between'} size={'large'}>
          <AddressInputs
            address={permit.exporter}
            recipient={'exporter'}
            onChange={(recipient, index, newValue) => {
              this.handleAddressChange(index, recipient, newValue)
            }}
            isValid={isValid}
          />
          <AddressInputs
            address={permit.importer}
            recipient={'importer'}
            onChange={(recipient, index, newValue) => {
              this.handleAddressChange(index, recipient, newValue)
            }}
            isValid={isValid}
          />
        </Columns>
        <Box
          justify={'between'}
          size={'full'}
          direction={'row'}
          margin={'medium'}>
          <Heading tag={'h3'}>{local.permits.species}</Heading>
          <Button
            label={local.permits.addSpecies}
            icon={<AddIcon />}
            onClick={() => this.addSpecies()}
          />
        </Box>
        {specimens.map((species, index) => (
          <SpeciesInputs
            key={index}
            index={index}
            species={species}
            onChange={(attr, newValue) => {
              this.handleSpeciesChange(index, attr, newValue)
            }}
            onRemove={index => {
              this.removeSpecies(index)
            }}
            isValid={isValid}
            hashSuggestions={hashSuggestions}
            permitType={permit.permitType}
          />
        ))}
        <Box
          justify={'center'}
          size={'full'}
          direction={'row'}
          margin={'medium'}>
          <Button
            primary={true}
            label={local.permits.createPermit}
            icon={<DocumentUploadIcon />}
            onClick={() => this.createPermit()}
          />
        </Box>
      </Box>
    )
  }
}

PermitCreate.propTypes = {
  accounts: PropTypes.object,
  PermitFactory: PropTypes.object,
  drizzleStatus: PropTypes.object,
  contracts: PropTypes.object,
  transactionStack: PropTypes.array,
  transactions: PropTypes.object
}

PermitCreate.contextTypes = {
  drizzle: PropTypes.object
}

export default PermitCreate
