import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Home extends Component {
  render() {
    return (
      <main style= { { background: '#F234' } } >
        Hello World!
      </main>
    )
  }
}

Home.propTypes = {
  accounts: PropTypes.object
}

export default Home
