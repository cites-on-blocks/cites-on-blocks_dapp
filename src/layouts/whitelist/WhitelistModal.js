import React, { Component } from 'react'
import { Box, Headline, Columns, Label } from 'grommet'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import local from '../../localization/localizedStrings'

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

class WhitlistModal extends Component {
  constructor() {
    super()
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
        <Box
          align="center"
          wrap={true}
          basis="xlarge"
          pad="large"
          margin="none"
          full={true}>
          <Headline className="headline" align="center" tag="h2">
            Senegal
          </Headline>
          <Columns justify="center" pad="medium" margin="small">
            <Box align="left" pad="none" margin="none">
              <Label>{local.whitelist.table.language}: deutsch</Label>
            </Box>
            <Box align="left" pad="none" margin="none">
              <Label>{local.whitelist.table.iso}: SE</Label>
            </Box>
            <Box align="left" pad="none" margin="none">
              <Label>{local.whitelist.table.entry}: 12/02/1974</Label>
            </Box>
            <Box align="left" pad="none" margin="none">
              <Label>{local.whitelist.table.joining}: 13/02/1975</Label>
            </Box>
          </Columns>
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

export default WhitlistModal
