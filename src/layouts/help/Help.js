import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Box, Heading, AccordionPanel, Accordion, Paragraph } from 'grommet'
import local from '../../localization/localizedStrings'

class Help extends Component {
  render() {
    return (
      <main>
        <Box pad={{ horizontal: 'large', vertical: 'large' }}>
          <Heading align="center" tag="h2">
            {local.help.headline}
          </Heading>
          <Heading align="left" tag="h3">
            {local.help.accordionHeadline}
          </Heading>
          <Accordion>
            <AccordionPanel heading={local.help.first}>
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.second}>
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.third}>
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.fourth}>
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </Paragraph>
            </AccordionPanel>
          </Accordion>
        </Box>
      </main>
    )
  }
}

Help.propTypes = {
  accounts: PropTypes.object
}

export default Help
