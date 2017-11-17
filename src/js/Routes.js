import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './screens/Home';
import DemandPage from './screens/Demand';
import TravelPage from './screens/Travel';
import TrackingPage from './screens/Tracking';

export default props => (
  <Switch>
    <Route
      exact={true}
      path='/'
      render={routeProps => (
        <HomePage {...routeProps} {...props} />)}
    />
    <Route
      exact={true}
      path='/demand/create'
      component={DemandPage}
    />
    <Route
      exact={true}
      path='/travel/create'
      component={TravelPage}
    />
    <Route
      exact={true}
      path='/track/:trackingId/:city1/:city2'
      component={TrackingPage}
    />
    <Route
      exact={true}
      path='/guide'
      component={TravelPage}
    />
  </Switch>);
