import React, { Component } from 'react'
import { Header, Image, Menu, Title } from 'grommet'
import logo from '../../imgs/croco.png'
import local from '../../localization/localizedStrings'

/*
 * Customized Header component to wrap the app in
 */

class CitesHeader extends Component {
  render() {
    return (
      <Header
        fixed={true}
        direction={'row'}
        align={'end'}
        justify="between"
        separator="bottom"
        pad={{ horizontal: 'small', vertical: 'small' }}>
        <Title>
          <Image src={logo} alt="logo" size="thumb" />
        </Title>
        <Menu direction={'row'}>
          <a href="/whitelist">{local.header.whitelist}</a>
          <a href="/permits">{local.header.permits}</a>
          <a href="/analytics">{local.header.analytics}</a>
          <a href="/import-export">{local.header.importExport}</a>
          <a href="/help">{local.header.help}</a>
          <a href="">Sprache</a>
        </Menu>
      </Header>
    )
  }
}

export default CitesHeader
