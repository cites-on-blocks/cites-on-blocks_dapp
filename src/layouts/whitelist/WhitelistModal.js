import React, { Component } from 'react'
import { Box, Headline } from 'grommet'

import '../../css/whitelist.css'

class WhitlistModal extends Component {
  render() {
    return (
      <main>
        <Box pad={{ horizontal: 'large', vertical: 'large' }}>
          <Headline className="headline" align="center" tag="h2">
            Senegal
          </Headline>
        </Box>
      </main>
    )
  }
}

export default WhitlistModal
