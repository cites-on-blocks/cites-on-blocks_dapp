import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { App as GrommetApp } from 'grommet'
import CitesHeader from '../CitesHeader/CitesHeader'
import CitesFooter from '../CitesFooter/CitesFooter'


 /*
  * Root component, setting up the Header and Footer for all the content
  */
class App extends Component {
  render() {
    return (
      <GrommetApp>
        <CitesHeader/>
          {this.props.children}
        <CitesFooter/>
      </GrommetApp>
    )
  }
}

App.propTypes = {
  children: PropTypes.node
}

export default App
