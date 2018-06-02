import React, { Component } from 'react'
import { Link } from 'react-router'
import { Header, Image, Menu, Title, Anchor } from 'grommet'
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
        pad={{ horizontal: 'small' }}>
        <Title>
          <Image src={logo} alt="logo" size="thumb" />
        </Title>
        <Menu direction={'row'}>
          <Link to="/whitelist">{local.header.whitelist}</Link>
          <Menu
            responsive={true}
            label={local.permits}
            inline={false}
            direction={'column'}>
            <Anchor path="/permits">List Permits</Anchor>
            <Anchor path="/permits/create">Create Permit</Anchor>
            <Anchor path="/permits/process">Process Permit</Anchor>
          </Menu>
          <Link to="/analytics">{local.header.analytics}</Link>
          <Link to="/import-export">{local.header.importExport}</Link>
          <Link to="/help">{local.header.help}</Link>
        </Menu>
      </Header>
    )
  }
}

export default CitesHeader
