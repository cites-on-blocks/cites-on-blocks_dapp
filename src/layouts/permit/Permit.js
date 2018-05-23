import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Permit extends Component {
  render() {
    return (
      <main>
        Permits in the making...
      </main>
    )
  }
}

Permit.propTypes = {
  accounts: PropTypes.object
}

export default Permit
