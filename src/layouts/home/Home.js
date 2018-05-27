import React, { Component } from 'react'
import PropTypes from 'prop-types'
import worldmap from '../../imgs/world_map_cites.png'
import { Box, Image } from 'grommet'

class Home extends Component {
  render() {
    return (
      <main>
        <Box pad={{ horizontal: 'large', vertical: 'large' }}>
          <Image src={worldmap} fit="contain" />
        </Box>
      </main>
    )
  }
}

Home.propTypes = {
  accounts: PropTypes.object
}

export default Home
