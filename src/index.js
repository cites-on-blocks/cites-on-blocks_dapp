import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'

// Layouts
import App from './components/App/App'
import HomeContainer from './layouts/home/HomeContainer'
import WhitelistContainer from './layouts/whitelist/WhitelistContainer'
import AnalyticsContainer from './layouts/analytics/AnalyticsContainer'
import HelpContainer from './layouts/help/HelpContainer'
import ImportExportContainer from './layouts/importExport/ImportExportContainer'
import PermitContainer from './layouts/permit/PermitContainer'
import { LoadingContainer } from 'drizzle-react-components'

import store from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <Router history={history}>
          <Route path="/" component={App}>
            <IndexRoute component={HomeContainer} />
          </Route>
          <Route path="/whitelist" component={App}>
            <IndexRoute component={WhitelistContainer} />
          </Route>
          <Route path="/analytics" component={App}>
            <IndexRoute component={AnalyticsContainer} />
          </Route>
          <Route path="/help" component={App}>
            <IndexRoute component={HelpContainer} />
          </Route>
          <Route path="/import-export" component={App}>
            <IndexRoute component={ImportExportContainer} />
          </Route>
          <Route path="/permits" component={App}>
            <IndexRoute component={PermitContainer} />
          </Route>
        </Router>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);
