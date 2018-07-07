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
              <Paragraph>{local.help.firstText}</Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.second}>
              <Paragraph>{local.help.secondText}</Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.third}>
              <Paragraph>{local.help.thirdText}</Paragraph>
            </AccordionPanel>
            <AccordionPanel heading={local.help.fourth}>
              <Paragraph>{local.help.fourthText}</Paragraph>
            </AccordionPanel>
          </Accordion>
          <Heading align="left" tag="h3">
            {local.help.contact}
          </Heading>
          <Form>
            <FormField label={local.help.contactName}>
              <TextInput />
            </FormField>
            <FormField label={local.help.contactMail}>
              <TextInput />
            </FormField>
            <FormField label={local.help.contactText}>
              <TextInput />
            </FormField>
            <Footer pad={{ vertical: 'medium' }}>
              <Button
                label={local.help.contactSend}
                type="submit"
                primary={true}
              />
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
