import React, { Component } from 'react'
import { Box, Footer, Label, SocialShare } from 'grommet'


/*
 * Customized Footer component to wrap the app in
 */
class CitesFooter extends Component {
  render() {
    return (
      <Footer direction="row" justify="between" separator="top" pad={ { horizontal: 'small', vertical: 'small' } }>
        <Label>2018 © CITES</Label>
        <Box direction="row">
            <SocialShare type="facebook" link={'https://cites.org/'}/>
            <SocialShare type="twitter" link={'https://cites.org/'}/>
            <SocialShare type="linkedin" link={'https://cites.org/'}/>
        </Box>
        <Box>
            <span>Cites Company:</span>
            <span>(1-⁠844-⁠627-⁠2871)</span>
            <span>Monday to Saturday,</span>
            <span>7 am - 9 pm E.T.</span>
        </Box>
      </Footer>
    );
  }
}

export default CitesFooter
