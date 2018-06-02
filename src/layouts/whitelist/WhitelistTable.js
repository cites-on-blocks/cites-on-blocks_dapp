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
    country: 'Senegal',
    language: 'SN',
    iso: 'SN',
    region: 'Africa',
    entry: '12/02/1974',
    join: '01/07/1975'
  },
  {
    country: 'Jordan',
    language: 'JO',
    iso: 'JO',
    region: 'Asia',
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
  }
]

class WhitelistTable extends Component {
  constructor(props) {
    super(props)
    this.onMore = this.onMore.bind(this)
    this.state = {
      data: DATA,
      layerActive: false,
      countryCode: '',
      addresses: []
    }
  }

  onClick(id) {
    this.setState({ layerActive: true })
    this.props.getAddressesFromCountry(this.state.data[id].iso)
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
          PermitFactory={this.props.PermitFactory}
          isOwner={this.state.isOwner}
          dataKeyAddresses={this.props.dataKeyAddresses}
        />
      </Layer>
    ) : null

    let rows = data.map((data, i) => {
      return (
        <TableRow onClick={this.onClick.bind(this, i)}>
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
        <Table
          responsive={false}
          onMore={data.length < 20 ? this.onMore : undefined}>
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
  dataKeyAddresses: PropTypes.string
}

export default WhitelistTable
