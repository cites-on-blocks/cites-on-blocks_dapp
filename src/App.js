import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
}

export default App
