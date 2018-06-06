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
        pad={{ horizontal: 'small', vertical: 'small' }}>
        <Title>
          <Image src={logo} alt="logo" size="thumb" />
        </Title>
        <Menu direction={'row'}>
          <Menu
            responsive={true}
            label={local.header.whitelist}
            inline={false}
            direction={'column'}>
            <Anchor path="/whitelist">
              {local.header.whitelistMenu.whitelist}
            </Anchor>
            <Anchor path="/whitelist/add">
              {local.header.whitelistMenu.whitelistAdd}
            </Anchor>
          </Menu>
          <Menu
            responsive={true}
            label={local.header.permits}
            inline={false}
            direction={'column'}>
            <Anchor path="/permits">
              {local.header.permitsMenu.listPermits}
            </Anchor>
            <Anchor path="/permits/create">
              {local.header.permitsMenu.createPermit}
            </Anchor>
            <Anchor path="/permits/process">
              {local.header.permitsMenu.processPermit}
            </Anchor>
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
