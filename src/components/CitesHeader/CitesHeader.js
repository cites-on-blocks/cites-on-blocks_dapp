import React, { Component } from 'react'
import { Header, Image, Menu, Title } from 'grommet'
import logo from '../../imgs/croco.png'
import s from '../../localization/localizedStrings'

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
          <a href="/whitelist">{s.whitelist}</a>
          <a href="/permits">{s.permits}</a>
          <a href="/analytics">{s.analytics}</a>
          <a href="/import-export">{s.importExport}</a>
          <a href="/help">{s.help}</a>
        </Menu>
      </Header>
    )
  }
}

export default CitesHeader
