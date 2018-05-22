import React, { Component } from 'react'
import { Box, Footer, Label, SocialShare } from 'grommet'
import s from '../../localization/localizedStrings'


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
            <span>{s.officeName}</span>
            <span>{s.contactPhone}</span>
            <span>{s.openingDays}</span>
            <span>{s.openingHours}</span>
        </Box>
      </Footer>
    );
  }
}

export default CitesFooter
