import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { utils } from 'web3'
import { Box, Heading } from 'grommet'
import local from '../../localization/localizedStrings'
import Table from './WhitelistTable'

class Whitelist extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      isOwner: false,
      dataKeyAddresses: ''
    }
    this.contracts = context.drizzle.contracts
    this.dataKeyOwner = this.contracts.PermitFactory.methods.owner.cacheCall()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.accounts[0] !== prevProps.accounts[0]) {
      this.checkOwner()
    }
    if (this.dataKeyOwner in this.props.PermitFactory.owner) {
      const isOwner =
        this.props.accounts[0] ===
        this.props.PermitFactory.owner[this.dataKeyOwner].value
      if (prevState.isOwner !== isOwner) {
        this.setState({ isOwner })
      }
    }
  }

  getAddressesFromCountry(countryCode) {
    const dataKeyAddresses = this.contracts.PermitFactory.methods.getCountry.cacheCall(
      utils.asciiToHex(countryCode)
    )
    this.setState({ dataKeyAddresses })
  }

  checkOwner() {
    if (this.dataKeyOwner in this.props.PermitFactory.owner) {
      if (
        this.props.accounts[0] ===
        this.props.PermitFactory.owner[this.dataKeyOwner].value
      ) {
        this.setState({ isOwner: true })
      } else {
        this.setState({ isOwner: false })
      }
    }
  }

  render() {
    return (
      <main>
        <Box pad={{ horizontal: 'large', vertical: 'large' }}>
          <Heading align="center" tag="h2">
            {local.whitelist.headline}
          </Heading>
          <Table
            dataKeyAddresses={this.state.dataKeyAddresses}
            accounts={this.props.accounts}
            PermitFactory={this.props.PermitFactory}
            Contracts={this.contracts}
            getAddressesFromCountry={countryCode =>
              this.getAddressesFromCountry(countryCode)
            }
            isOwner={this.state.isOwner}
          />
        </Box>
      </main>
    )
  }
}

Whitelist.propTypes = {
  accounts: PropTypes.object,
  PermitFactory: PropTypes.object
}

Whitelist.contextTypes = {
  drizzle: PropTypes.object
}

export default Whitelist
