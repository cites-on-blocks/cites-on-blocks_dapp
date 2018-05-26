import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Box, Heading } from 'grommet'
import local from '../../localization/localizedStrings'
import Table from './WhitelistTable'

class Whitelist extends Component {
  render() {
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
  accounts: PropTypes.object
}

export default Whitelist
