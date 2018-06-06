import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Heading,
  AccordionPanel,
  Accordion,
  Paragraph,
  TextInput,
  FormField,
  Form,
  Footer,
  Button
} from 'grommet'
import local from '../../localization/localizedStrings'

class Help extends Component {
  render() {
    return (
      <main>
        <Box full={true} pad={{ horizontal: 'large' }}>
          <Heading align="center" tag="h2">
            {local.help.headline}
          </Heading>
          <Heading align="start" tag="h3">
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
          <Heading align="left" tag="h3">
            {local.help.contact}
          </Heading>
          <Form>
            <FormField label="Name">
              <TextInput />
            </FormField>
            <FormField label="E-Mail">
              <TextInput />
            </FormField>
            <FormField label="Text">
              <TextInput />
            </FormField>
            <Footer pad={{ vertical: 'medium' }}>
              <Button label="Submit" type="submit" primary={true} />
            </Footer>
          </Form>
        </Box>
      </main>
    )
  }
}

Help.propTypes = {
  accounts: PropTypes.object
}

export default Help
