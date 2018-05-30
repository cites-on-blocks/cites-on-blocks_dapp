import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Box, Heading } from 'grommet'
import local from '../../localization/localizedStrings'
import Table from './WhitelistTable'

class Whitelist extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts
    this.dataKeyOwner = this.contracts.PermitFactory.methods.owner.cachCall()
  }

  render() {
    console.log(this.props.PermitFactory.owner[this.dataKeyOwner].value)
    return (
      <main>
        <Box pad={{ horizontal: 'large', vertical: 'large' }}>
          <Heading align="center" tag="h2">
            {local.whitelist.headline}
          </Heading>
          <Table />
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
