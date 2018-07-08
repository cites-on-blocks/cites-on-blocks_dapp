import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'

// Layouts
import App from './components/App/App'
import HomeContainer from './layouts/home/HomeContainer'
import WhitelistContainer from './layouts/whitelist/WhitelistContainer'
import WhitelistAddContainer from './layouts/whitelistAdd/WhitelistAddContainer'
import AnalyticsContainer from './layouts/analytics/AnalyticsContainer'
import HelpContainer from './layouts/help/HelpContainer'
import ImportExportContainer from './layouts/importExport/ImportExportContainer'
import PermitsContainer from './layouts/permits/PermitsContainer'
import PermitCreateContainer from './layouts/permitCreate/PermitCreateContainer'
import AnalyticMapContainer from './layouts/analyticMap/AnalyticMapContainer'
import AnalyticCountryDashboardContainer from './layouts/analyticCountryDashboard/AnalyticCountryDashboardContainer'
import AnalyticDashboardContainer from './layouts/analyticDashboard/AnalyticDashboardContainer'
import { LoadingContainer } from 'drizzle-react-components'

//Stylesheets
import './css/grommet.min.css'

import store from './store'
import drizzleOptions from './drizzleOptions'

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store)

/*
 * Routes built to the different menu section points
 */

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <LoadingContainer>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={HomeContainer} />
        </Route>
        <Route path="/whitelist" component={App}>
          <IndexRoute component={WhitelistContainer} />
        </Route>
        <Route path="/whitelist/add" component={App}>
          <IndexRoute component={WhitelistAddContainer} />
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
          <IndexRoute component={PermitsContainer} />
        </Route>
        <Route path="/permits/create" component={App}>
          <IndexRoute component={PermitCreateContainer} />
        </Route>
        <Route path="/analytics/map" component={App}>
          <IndexRoute component={AnalyticMapContainer} />
        </Route>
        <Route path="/analytics/dashboard" component={App}>
          <IndexRoute component={AnalyticDashboardContainer} />
        </Route>
        <Route path="/analytics/country" component={App}>
          <IndexRoute component={AnalyticCountryDashboardContainer} />
        </Route>
      </Router>
    </LoadingContainer>
  </DrizzleProvider>,
  document.getElementById('root')
)
