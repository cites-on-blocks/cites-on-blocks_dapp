import React, { Component } from 'react'
import { Link } from 'react-router'
import { Header, Image, Menu, Title, Anchor } from 'grommet'
import logo from '../../imgs/croco.png'
import local from '../../localization/localizedStrings'
import FlagIconFactory from 'react-flag-icon-css'

/*
 * Customized Header component to wrap the app in
 */

class CitesHeader extends Component {
  render() {
    const FlagIcon = FlagIconFactory(React, { useCssModules: false })
    const currentLanguage =
      local.getLanguage() === 'en' ? 'gb' : local.getLanguage()
    const languages = local
      .getAvailableLanguages()
      .map(function(language, index) {
        if (language === local.getLanguage()) {
          return
        } else {
          let code = language === 'en' ? 'gb' : language
          return (
            <Anchor
              key={index}
              onClick={() => {
                local.setLanguage(language)
              }}>
              <FlagIcon code={code} size="lg" />
            </Anchor>
          )
        }
      })
    return (
      <Header
        fixed={true}
        direction={'row'}
        align={'end'}
        justify="between"
        separator="bottom"
        pad={{ horizontal: 'small' }}>
        <Title>
          <Link to="/">
            <Image src={logo} alt="logo" size="thumb" />
          </Link>
        </Title>
        <Menu direction={'row'}>
          <Menu
            responsive={true}
            label={local.header.whitelist}
            inline={false}
            direction={'column'}>
            <Anchor path="/whitelist" style={{ color: 'black' }}>
              {local.header.whitelistMenu.whitelist}
            </Anchor>
            <Anchor path="/whitelist/add" style={{ color: 'black' }}>
              {local.header.whitelistMenu.whitelistAdd}
            </Anchor>
          </Menu>
          <Menu
            responsive={true}
            label={local.header.permits}
            inline={false}
            direction={'column'}>
            <Anchor path="/permits" style={{ color: 'black' }}>
              {local.header.permitsMenu.listPermits}
            </Anchor>
            <Anchor path="/permits/create" style={{ color: 'black' }}>
              {local.header.permitsMenu.createPermit}
            </Anchor>
            <Anchor path="/permits/process" style={{ color: 'black' }}>
              {local.header.permitsMenu.processPermit}
            </Anchor>
          </Menu>
          <Link to="/analytics" style={{ color: 'black' }}>
            {local.header.analytics}
          </Link>
          <Link to="/import-export" style={{ color: 'black' }}>
            {local.header.importExport}
          </Link>
          <Link to="/help" style={{ color: 'black' }}>
            {local.header.help}
          </Link>
          <Menu
            responsive={true}
            label={<FlagIcon code={currentLanguage} size="lg" />}
            inline={false}
            direction={'column'}>
            {languages}
          </Menu>
        </Menu>
      </Header>
    )
  }
}

export default CitesHeader
