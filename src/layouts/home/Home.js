import React, { Component } from 'react'
import PropTypes from 'prop-types'
import worldmap from '../../imgs/world_map_cites.png'
import { Hero, Image, Headline } from 'grommet'

import '../../css/home.css'

class Home extends Component {
  render() {
    return (
      <main>
        <Hero
          size="large"
          pad={{ horizontal: 'large', vertical: 'large' }}
          background={
            <Image src={worldmap} full={true} align={{ top: true }} />
          }>
          <Headline className="cites-header" align="center">
            Cites on Blockchain
          </Headline>
        </Hero>
      </main>
    )
  }
}

Home.propTypes = {
  accounts: PropTypes.object
}

export default Home
