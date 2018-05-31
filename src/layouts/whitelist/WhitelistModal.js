import React, { Component } from 'react'
import { Box, Headline, Label } from 'grommet'
import PropTypes from 'prop-types'
import local from '../../localization/localizedStrings'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'

import '../../css/whitelist.css'

const DATA = [
  {
    publicID: 'De-234294da-asdnadu342',
    entry: '12/02/2018'
  },
  {
    publicID: 'DE-8uihkj-7uyhjbkkljn',
    entry: '14/01/2018'
  }
]

class WhitelistModal extends Component {
  constructor(props) {
    super(props)
    this.onMore = this.onMore.bind(this)
    this.state = { data: DATA }
  }

  onMore() {
    let data = this.state.data.slice(0)
    if (data.length < 20) {
      data = data.concat(
        DATA.map((d, i) => ({
          ...d,
          uid: data.length + i + 1
        }))
      )
    }
    this.setState({ data })
  }

  render() {
    const { data } = this.state
    console.log(this.props.dataKeyAddresses)
    console.log(this.props.PermitFactory)
    if (
      this.props.dataKeyAddresses in this.props.PermitFactory.authorityMapping
    ) {
      console.log(
        this.props.PermitFactory.authorityMapping[this.dataKeyAddresses].value
      )
    }

    let rows = data.map(data => {
      return (
        <TableRow onClick={this.onClick}>
          <td>{data.uid}</td>
          <td>{data.publicID}</td>
          <td>{data.entry}</td>
        </TableRow>
      )
    })

    return (
      <main>
        <Box align="center" full={true} pad="small">
          <Headline className="headline" align="center" tag="h2">
            Senegal
          </Headline>
          <Box direction="row" full={true} pad="small">
            <Box full={true} pad="small" align="center">
              <Label>{local.whitelist.table.language}: deutsch</Label>
              <Label>{local.whitelist.table.entry}: 12/02/1974</Label>
            </Box>
            <Box full={true} pad="small" align="center">
              <Label>{local.whitelist.table.iso}: SE</Label>
              <Label>{local.whitelist.table.joining}: 13/02/1975</Label>
            </Box>
          </Box>
          <Table
            responsive={false}
            onMore={data.length < 20 ? this.onMore : undefined}>
            <thead>
              <tr>
                <th>{local.whitelist.layer.number}</th>
                <th>{local.whitelist.layer.publicID}</th>
                <th>{local.whitelist.layer.entry}</th>
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
  getAddressesFromCountry: PropTypes.func,
  PermitFactory: PropTypes.object,
  dataKeyAddresses: PropTypes.func
}

export default WhitelistModal
