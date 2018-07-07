import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WorldMap, Box, Headline } from 'grommet'
import Web3 from 'web3'
import { COUNTRIES } from '../../util/countries'

import {
  blockNumberToUnix,
  getWhitelistEvents,
  mergeWhitelistEvents
} from '../../util/permitUtils'

import '../../css/home.css'

class Home extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      whitelistEvents: []
    }
    this.contracts = context.drizzle.contracts
    // NOTE: We have to iniate a new web3 instance for retrieving event via `getPastEvents`.
    //       MetaMask does not support websockets and Drizzle retrieves events via subscriptions.
    const web3 = new Web3(this.contracts.PermitFactory.givenProvider)
    const { abi, address } = this.contracts.PermitFactory
    this.PermitFactory = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  async componentDidMount() {
    await this.getWhitelistedEvents()
  }

  async getWhitelistedEvents(from = 0) {
    const [addWhitelist, removedWhitelist] = await Promise.all([
      getWhitelistEvents(this.PermitFactory, 'AddressWhitelisted', from),
      getWhitelistEvents(this.PermitFactory, 'AddressRemoved', from)
    ])
    const whitelistEvents = addWhitelist.concat(removedWhitelist)
    const newWhitelistEvents = await blockNumberToUnix(
      this.web3,
      whitelistEvents
    )
    const mergedWhitelistEvents = mergeWhitelistEvents(
      whitelistEvents,
      newWhitelistEvents
    )

    const result = this.createMapSeries(mergedWhitelistEvents)
    this.setState({
      ...this.state,
      whitelistEvents: result
    })
  }

  createMapSeries(arr) {
    let whitelistArray = arr

    let result = Object.values(
      whitelistArray.reduce((c, { country }) => {
        c[country] = c[country] || {
          label: COUNTRIES[country].name,
          colorIndex: 'brand',
          id: COUNTRIES[country].name,
          place: [COUNTRIES[country].latitude, COUNTRIES[country].longitude]
        }
        return c
      }, {})
    )
    return result
  }

  render() {
    console.log(this.state.whitelistEvents)
    return (
      <main>
        <Box align="center" justify="center" className="cites-box">
          <WorldMap
            colorIndex="unknown"
            className="cites-svg"
            series={this.state.whitelistEvents}
          />
          <Headline className="cites-header" align="center">
            Cites on Blockchain
          </Headline>
        </Box>
      </main>
    )
  }
}

Home.propTypes = {
  accounts: PropTypes.object
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
