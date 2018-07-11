import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Box,
  Columns,
  Heading,
  Paragraph,
  Select,
  FormField,
  AddIcon,
  DocumentUploadIcon
} from 'grommet'
import Web3, { utils } from 'web3'
import { parseString } from 'xml2js'

import AddressInputs from '../../components/AddressInputs'
import SpeciesInputs from '../../components/SpeciesInputs'
import PendingTxModal from '../../components/PendingTxModal'
import { isASCII } from '../../util/stringUtils'
import * as permitUtils from '../../util/permitUtils'
import local from '../../localization/localizedStrings'
import { COUNTRY_OPTS } from '../../util/options'

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
      xmlToJSON: {},
      isXML: 'initial',
      isCITESXML: 'initial',
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
      this.stackId =
        this.state.permitForm === 'DIGITAL'
          ? this.contracts.PermitFactory.methods.createPermit.cacheSend(
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
          : this.contracts.PermitFactory.methods.createPaperPermit.cacheSend(
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
          text: local.permitCreate.pending
        }
      })
    } else if (newTxState === 'success') {
      this.stackId = ''
      this.setState({
        txStatus: 'success',
        modal: {
          show: true,
          text: local.permitCreate.successful
        }
      })
    } else {
      this.stackId = ''
      this.setState({
        txStatus: 'failed',
        modal: {
          show: true,
          text: local.permitCreate.failed
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
      isASCII(permit.importer[0]) &&
      isASCII(permit.importer[1]) &&
      isASCII(permit.importer[2]) &&
      permit.exporter &&
      isASCII(permit.exporter[0]) &&
      isASCII(permit.exporter[1]) &&
      isASCII(permit.exporter[2])
    const specimensValid = specimens.reduce((isValid, specimen) => {
      let validHashes
      const {
        quantity,
        scientificName,
        commonName,
        originHash,
        reExportHash,
        description
      } = specimen
      if (permit.permitType === 'RE-EXPORT') {
        validHashes =
          permitUtils.isValidPermitHash(originHash) &&
          permitUtils.isValidPermitHash(reExportHash)
      } else {
        validHashes = true
      }
      return (
        isValid &&
        quantity > 0 &&
        scientificName &&
        isASCII(scientificName) &&
        commonName &&
        isASCII(commonName) &&
        isASCII(description) &&
        validHashes
      )
    }, true)
    return permitValid && specimensValid
  }

  getError(value, errText) {
    const { isValid } = this.state
    return isValid === 'initial' ? '' : !value && !isValid && errText
  }

  closeTxModal() {
    this.setState({
      txStatus: '',
      modal: {
        show: false,
        text: ''
      }
    })
  }

  getXMLNamespace() {
    const xml = this.state.xmlToJSON
    return Object.keys(xml)[0].split(':')[0] //maybe better to work with the text/xml. this works for now
  }

  isCITESXML() {
    const { xmlToJSON } = this.state
    const XMLNamespace = this.getXMLNamespace()

    let headerExists = true
    let consigneeExists = true
    let consignorExists = true
    let tradelineItemExists = true

    try {
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':HeaderExchangedDocument'
      ][0]
    } catch (e) {
      headerExists = false
    }

    try {
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':SpecifiedSupplyChainConsignment'
      ][0].ConsigneeTradeParty
    } catch (e) {
      consigneeExists = false
    }

    try {
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':SpecifiedSupplyChainConsignment'
      ][0].ConsignorTradeParty
    } catch (e) {
      consignorExists = false
    }

    try {
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':SpecifiedSupplyChainConsignment'
      ][0].IncludedSupplyChainConsignmentItem[0]
        .IncludedSupplyChainTradeLineItem
    } catch (e) {
      tradelineItemExists = false
    }

    return (
      headerExists && consignorExists && consigneeExists && tradelineItemExists
    )
  }

  getTypeString(typeCode) {
    let result = 'EXPORT'
    if (typeCode === 'O') {
      result = 'OTHER'
    } else if (typeCode === 'R') {
      result = 'RE-EXPORT'
    }
    return result
  }

  handleUpload() {
    if (!this.state.isXML) {
      return
    }
    if (!this.isCITESXML()) {
      let { isCITESXML } = this.state
      isCITESXML = false
      this.setState({ isCITESXML })
      return
    }
    this.setState({ isCITESXML: true })
    const { permit } = this.state
    const { xmlToJSON } = this.state
    console.log(xmlToJSON)
    const XMLNamespace = this.getXMLNamespace()
    const permitType =
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':HeaderExchangedDocument'
      ][0].TypeCode[0]
    permit.permitType = this.getTypeString(permitType)
    const generalInfo =
      xmlToJSON[XMLNamespace + ':CITESEPermit'][
        XMLNamespace + ':SpecifiedSupplyChainConsignment'
      ][0]
    //set address data
    const exportInfo = generalInfo.ConsignorTradeParty[0]
    const exportAddress = exportInfo.PostalTradeAddress[0]
    permit.exportCountry = exportAddress.CountryID
    permit.exporter = [
      exportInfo.Name[0],
      exportAddress.StreetName[0],
      exportAddress.CityName[0]
    ]
    const importInfo = generalInfo.ConsigneeTradeParty[0]
    const importAddress = importInfo.PostalTradeAddress[0]
    permit.importCountry = importAddress.CountryID
    permit.importer = [
      importInfo.Name[0],
      importAddress.StreetName[0],
      importAddress.CityName[0]
    ]
    //set species data
    const speciesXML = generalInfo.IncludedSupplyChainConsignmentItem
    const speciesArray = speciesXML.map(xml => {
      const specimen = permitUtils.DEFAULT_SPECIMEN
      const xmlData =
        xml.IncludedSupplyChainTradeLineItem[0].SpecifiedTradeProduct[0]
      specimen.scientificName = xmlData.ScientificName[0]
      specimen.commonName = xmlData.CommonName[0]
      specimen.description = xmlData.Description[0]
      specimen.quantity = xml.TransportLogisticsPackage[0].ItemQuantity[0]._
      return specimen
    })
    this.setState({
      permit,
      specimens: speciesArray
    })
    console.log(this.state)
  }

  handleUploadChange(event) {
    let { isXML } = this.state
    if (event.target.files[0].name.split('.')[1] !== 'xml') {
      isXML = false
      this.setState({ isXML })
      return
    }
    isXML = true
    this.setState({ isXML })
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = event => {
      const xml = event.target.result
      parseString(xml, (err, result) => {
        const xmlToJSON = result
        this.setState({ xmlToJSON })
      })
    }
    reader.readAsText(file)
  }

  render() {
    var XMLerror = ''
    var CITESXMLError = ''
    if (!(this.state.isXML || this.state.isXML === 'initial')) {
      XMLerror = (
        <Paragraph style={{ color: 'red' }}>
          {local.permitCreate.noXMLImportError}
        </Paragraph>
      )
    }
    if (!(this.state.isCITESXML || this.state.isCITESXML === 'initial')) {
      CITESXMLError = (
        <Paragraph style={{ color: 'red' }}>
          {local.permitCreate.noCITESXMLError}
        </Paragraph>
      )
    }
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
            onClose={() => this.closeTxModal()}
            onSuccessActions={
              <Columns justify={'between'} size={'small'}>
                <Button
                  label={local.permitCreate.newPermit}
                  onClick={() => this.clearForm()}
                />
                <Button
                  label={local.permitCreate.goToPermit}
                  path={'/permits'}
                />
              </Columns>
            }
            onFailActions={
              <Columns justify={'between'} size={'small'}>
                <Button
                  label={local.permitCreate.newPermit}
                  onClick={() => this.clearForm()}
                />
                <Button
                  label={local.permitCreate.tryAgain}
                  onClick={() => this.addSpecies()}
                />
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
                  : COUNTRY_OPTS.filter(c => c.value !== permit.importCountry)
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
                  : COUNTRY_OPTS.filter(c => c.value !== permit.exportCountry)
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
        <Box
          justify={'center'}
          size={'full'}
          direction={'row'}
          margin={'medium'}>
          <input
            type="file"
            accept="text/xml"
            onChange={event => this.handleUploadChange(event)}
          />
          <Button
            label={local.permits.importFromXML}
            icon={<DocumentUploadIcon />}
            onClick={() => this.handleUpload()}
          />
        </Box>
        <Box
          justify={'center'}
          size={'full'}
          direction={'row'}
          margin={'medium'}>
          {XMLerror}
          {CITESXMLError}
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
