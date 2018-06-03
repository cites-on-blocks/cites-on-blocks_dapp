import React, { Component } from 'react'
import { Box, Headline, Label } from 'grommet'
import PropTypes from 'prop-types'
import local from '../../localization/localizedStrings'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import FlagIconFactory from 'react-flag-icon-css'
import { utils } from 'web3'
import '../../css/whitelist.css'

var adresses = []

class WhitelistModal extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      adresses: []
    }
    console.warn('Context: ' + context)
    console.warn('Drizzle: ' + context.drizzle)
    this.contracts = context.drizzle.contracts
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
      console.warn('Is address')
    }
  }

  render() {
    const FlagIcon = FlagIconFactory(React, { useCssModules: false })
    console.log(adresses)
    let rows
    if (adresses !== undefined) {
      rows = adresses.map((data, index) => {
        return (
          <TableRow key={index}>
            <td>{index + 1}</td>
            <td>{data}</td>
            <td />
            <td onClick={this.removeAddressFromWhitelist.bind(this, data)}>
              <a>Remove</a>
            </td>
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
                <th>{local.whitelist.layer.number}</th>
                <th>{local.whitelist.layer.publicID}</th>
                <th>{local.whitelist.layer.entry}</th>
                <th />
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Box>
      </main>
    )
  }
}

WhitelistModal.propTypes = {
  getCountry: PropTypes.func,
  PermitFactory: PropTypes.object,
  country: PropTypes.object,
  contracts: PropTypes.object,
  dataKeyAddresses: PropTypes.string
}

WhitelistModal.contextTypes = {
  drizzle: PropTypes.object
}

export default WhitelistModal
