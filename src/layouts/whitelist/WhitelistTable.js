import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Layer from 'grommet/components/Layer'
import local from '../../localization/localizedStrings'
import FlagIconFactory from 'react-flag-icon-css'

import WhitelistModal from './WhitelistModal'

const DATA = [
  {
    country: 'France',
    language: 'FR',
    iso: 'FR',
    region: 'Europe',
    entry: '12/02/1974',
    join: '01/07/1975'
  },
  {
    country: 'Togo',
    language: 'TG',
    iso: 'TG',
    region: 'Africa',
    entry: '14/01/1974',
    join: '01/07/1975'
  },
  {
    country: 'Denmark',
    language: 'DK',
    iso: 'DK',
    region: 'Europe',
    entry: '14/01/1974',
    join: '01/07/1975'
  },
  {
    country: 'Switzerland',
    language: 'CH',
    iso: 'CH',
    region: 'Europe',
    entry: '09/07/1974',
    join: '01/07/1975'
  },
  {
    country: 'Sweden',
    language: 'SE',
    iso: 'SE',
    region: 'Europe',
    entry: '20/08/1974',
    join: '01/07/1975'
  },
  {
    country: 'Russian Federation',
    language: 'RU',
    iso: 'RU',
    region: 'Europe',
    entry: '20/08/1974',
    join: '01/07/1975'
  },
  {
    country: 'Germany',
    language: 'DE',
    iso: 'DE',
    region: 'Europe',
    entry: '20/08/1974',
    join: '01/07/1975'
  }
]

class WhitelistTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: DATA,
      layerActive: false,
      countryCode: '',
      addresses: [],
      countryToModal: null
    }
  }

  onClick(id) {
    this.setState({ layerActive: true })
    this.props.getAddressesFromCountry(this.state.data[id].iso)
    this.setState({
      countryToModal: this.state.data[id]
    })
  }

  render() {
    const { data } = this.state
    const FlagIcon = FlagIconFactory(React, { useCssModules: false })
    const layer = this.state.layerActive ? (
      <Layer
        closer={true}
        flush={true}
        onClose={() => {
          this.setState({
            layerActive: false
          })
        }}>
        <WhitelistModal
          country={this.state.countryToModal}
          PermitFactory={this.props.PermitFactory}
          isOwner={this.state.isOwner}
          dataKeyAddresses={this.props.dataKeyAddresses}
        />
      </Layer>
    ) : null

    let rows = data.map((data, i) => {
      return (
        <TableRow onClick={this.onClick.bind(this, i)} key={i}>
          <td>{data.country}</td>
          <td>
            <FlagIcon code={data.iso.toLowerCase()} size="lg" />
          </td>
          <td>{data.iso}</td>
          <td>{data.region}</td>
          <td>{data.entry}</td>
          <td>{data.join}</td>
        </TableRow>
      )
    })

    return (
      <main>
        {layer}
        <Table responsive={false}>
          <thead>
            <tr>
              <th>{local.whitelist.table.country}</th>
              <th>{local.whitelist.table.language}</th>
              <th>{local.whitelist.table.iso}</th>
              <th>{local.whitelist.table.region}</th>
              <th>{local.whitelist.table.entry}</th>
              <th>{local.whitelist.table.joining}</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </main>
    )
  }
}

WhitelistTable.propTypes = {
  getAddressesFromCountry: PropTypes.func,
  PermitFactory: PropTypes.object,
  countryToModal: PropTypes.object,
  dataKeyAddresses: PropTypes.string
}

export default WhitelistTable
