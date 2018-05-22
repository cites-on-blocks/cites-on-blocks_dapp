import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Home extends Component {
  render() {
    return (
      <main>
        Hello World!
      </main>
    )
  }
}

Home.propTypes = {
  accounts: PropTypes.object
}

export default Home
