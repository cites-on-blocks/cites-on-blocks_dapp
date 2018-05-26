import React, { Component } from 'react'
import { Box, Footer, Label, SocialShare } from 'grommet'

import local from '../../localization/localizedStrings'

/*
 * Customized Footer component to wrap the app in
 */
class CitesFooter extends Component {
  render() {
    return (
      <Footer
        direction="row"
        justify="between"
        separator="top"
        pad={{ horizontal: 'small', vertical: 'small' }}>
        <Label>2018 © CITES</Label>
        <Box direction="row">
          <SocialShare type="facebook" link={'https://cites.org/'} />
          <SocialShare type="twitter" link={'https://cites.org/'} />
          <SocialShare type="linkedin" link={'https://cites.org/'} />
        </Box>
        <Box>
          <span>{local.footer.officeName}</span>
          <span>{local.footer.contactPhone}</span>
          <span>{local.footer.openingDays}</span>
          <span>{local.footer.openingHours}</span>
        </Box>
      </Footer>
    )
  }
}

export default CitesFooter
