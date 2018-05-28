import React, { Component } from 'react'
import { Link } from 'react-router'
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
          <Link to="/whitelist">{s.whitelist}</Link>
          <Link to="/permits">{s.permits}</Link>
          <Link to="/analytics">{s.analytics}</Link>
          <Link to="/import-export">{s.importExport}</Link>
          <Link to="/help">{s.help}</Link>
        </Menu>
      </Header>
    )
  }
}

export default CitesHeader
