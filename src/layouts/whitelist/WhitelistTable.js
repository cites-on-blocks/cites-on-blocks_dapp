import React, { Component } from 'react'

import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Layer from 'grommet/components/Layer'
import local from '../../localization/localizedStrings'

import WhitelistModal from './WhitelistModal'

const DATA = [
  {
    country: 'Senegal',
    language: 'SN',
    iso: 'SN',
    region: 'Africa',
    entry: '12/02/1974',
    join: '01/07/1975',
    img: require('../../imgs/flags/senegal.png')
  },
  {
    country: 'Jordan',
    language: 'JO',
    iso: 'JO',
    region: 'Asia',
    entry: '14/01/1974',
    join: '01/07/1975',
    img: require('../../imgs/flags/jordan.png')
  },
  {
    country: 'Denmark',
    language: 'DK',
    iso: 'DK',
    region: 'Europe',
    entry: '14/01/1974',
    join: '01/07/1975',
    img: require('../../imgs/flags/denmark.png')
  },
  {
    country: 'Switzerland',
    language: 'CH',
    iso: 'CH',
    region: 'Europe',
    entry: '09/07/1974',
    join: '01/07/1975',
    img: require('../../imgs/flags/switzerland.png')
  },
  {
    country: 'Sweden',
    language: 'SE',
    iso: 'SE',
    region: 'Europe',
    entry: '20/08/1974',
    join: '01/07/1975',
    img: require('../../imgs/flags/sweden.png')
  }
]

class WhitlistTable extends Component {
  constructor() {
    super()
    this.onMore = this.onMore.bind(this)
    this.state = { data: DATA, layerActive: false }
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.setState({ layerActive: true })
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

    const layer = this.state.layerActive ? (
      <Layer
        closer={true}
        flush={true}
        onClose={() => {
          this.setState({
            layerActive: false
          })
        }}>
        <WhitelistModal />
      </Layer>
    ) : null

    let rows = data.map(data => {
      return (
        <TableRow onClick={this.onClick}>
          <td>{data.country}</td>
          <td>
            <img height={34} src={data.img} />
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

export default WhitlistTable
