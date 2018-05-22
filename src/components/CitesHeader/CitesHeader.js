import React, { Component } from 'react'
import { Header, Menu, Title } from 'grommet'
import s from '../../localization/localizedStrings'


/*
 * Customized Header component to wrap the app in
 */
class CitesHeader extends Component {
  render() {
    return (
      <Header fixed={true} className={'cites-header'} direction={'row'}
      align={'end'} justify="between" separator="bottom" pad={ { horizontal: 'small', vertical: 'small' } } >
          <Title>
            CITES on Blocks
          </Title>
          <Menu direction={'row'}>
            <a href="/whitelist">{s.whitelist}</a>
            <a href="/permits">{s.permits}</a>
            <a href="/analytics">{s.analytics}</a>
            <a href="/import-export">{s.importExport}</a>
            <a href="/help">{s.help}</a>
          </Menu>
        </Header>
    );
  }
}

export default CitesHeader