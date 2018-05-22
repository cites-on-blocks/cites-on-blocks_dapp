import React, { Component } from 'react'
import { Header, Menu, Title } from 'grommet'


/*
 * Customized Header component to wrap the app in
 */
class CitesHeader extends Component {
  render() {
    return (
      <Header fixed={true} className={'cites-header'} direction={'row'}
      align={'end'} justify="between" separator="bottom" pad={ { horizontal: 'small', vertical: 'small' } } >
          <Title>
            CITES on Block
          </Title>
          <Menu direction={'row'}>
            <a href="/whitelist">Whitelist</a>
            <a href="/permits">Permit</a>
            <a href="/analytics">Analyse</a>
            <a href="/import-export">Import/Export</a>
            <a href="/help">Hilfe</a>
          </Menu>
        </Header>
    );
  }
}

export default CitesHeader
