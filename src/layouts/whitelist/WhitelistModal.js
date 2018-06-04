import React, { Component } from 'react'
import { Button, Box, CheckBox, Headline, Label } from 'grommet'
import PropTypes from 'prop-types'
import local from '../../localization/localizedStrings'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import FlagIconFactory from 'react-flag-icon-css'
import { utils } from 'web3'
import '../../css/whitelist.css'

var adresses = []

class WhitelistModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      adresses: [],
      selectedAddresses: []
    }
  }

  componentDidUpdate() {
    if (this.props.dataKeyAddresses in this.props.PermitFactory.getCountry) {
      adresses = this.props.PermitFactory.getCountry[
        this.props.dataKeyAddresses
      ].value
    }
  }

  removeAddressFromWhitelist(address) {
    if (utils.isAddress(address)) {
      this.props.Contracts.PermitFactory.methods.removeAddress.cacheSend(
        address,
        {
          from: this.props.accounts[0]
        }
      )
    }
  }

  removeAllSelected() {
    if (
      this.state.selectedAddresses !== undefined &&
      this.state.selectedAddresses.length !== 0
    ) {
      this.props.Contracts.PermitFactory.methods.removeAddresses.cacheSend(
        this.state.selectedAddresses,
        {
          from: this.props.accounts[0]
        }
      )
    }
  }

  checkBoxStateDidChange(address) {
    let addresses = this.state.selectedAddresses
    if (!this.state.selectedAddresses.includes(address)) {
      addresses.push(address)
    } else {
      addresses.splice(addresses.indexOf(address), 1)
    }
    this.setState({ selectedAddresses: addresses })
  }

  render() {
    const FlagIcon = FlagIconFactory(React, { useCssModules: false })
    console.log(adresses)
    let rows
    if (adresses !== undefined) {
      rows = adresses.map((data, index) => {
        return (
          <TableRow key={index}>
            {this.props.isOwner && (
              <td>
                <CheckBox
                  onChange={this.checkBoxStateDidChange.bind(this, data)}
                />
              </td>
            )}
            <td>{index + 1}</td>
            <td>{data}</td>
            <td />
            {this.props.isOwner && (
              <td onClick={this.removeAddressFromWhitelist.bind(this, data)}>
                <a>{local.whitelist.remove}</a>
              </td>
            )}
          </TableRow>
        )
      })
    } else {
      rows = null
    }

    return (
      <main>
        <Box align="center" full={true} pad="small">
          <Headline className="headline" align="center" tag="h2">
            {this.props.country.country}
          </Headline>
          <Box direction="row" pad="none" margin="none">
            <Box pad="small" align="center" margin="none">
              <Label>
                {local.whitelist.table.language}:
                <FlagIcon
                  code={this.props.country.language.toLowerCase()}
                  size="lg"
                />
              </Label>
              <Label>
                {local.whitelist.table.entry}: {this.props.country.entry}
              </Label>
            </Box>
            <Box pad="small" align="center" margin="none">
              <Label>
                {local.whitelist.table.iso}: {this.props.country.iso}
              </Label>
              <Label>
                {local.whitelist.table.joining}: {this.props.country.join}
              </Label>
            </Box>
          </Box>
          <Table responsive={false}>
            <thead>
              <tr>
                {this.props.isOwner && <th />}
                <th>{local.whitelist.layer.number}</th>
                <th>{local.whitelist.layer.publicID}</th>
                <th>{local.whitelist.layer.entry}</th>
                {this.props.isOwner && <th />}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          {this.props.isOwner && (
            <Button primary={true} onClick={this.removeAllSelected.bind(this)}>
              {local.whitelist.removeSelected}
            </Button>
          )}
        </Box>
      </main>
    )
  }
}

WhitelistModal.propTypes = {
  getCountry: PropTypes.func,
  PermitFactory: PropTypes.object,
  accounts: PropTypes.object,
  Contracts: PropTypes.object,
  country: PropTypes.object,
  dataKeyAddresses: PropTypes.string,
  isOwner: PropTypes.bool
}

export default WhitelistModal
