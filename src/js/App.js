import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { createBrowserHistory } from 'history';

import { Grommet } from 'grommet';
import chainline from './themes/chainline';

import Home from './screens/Home';

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Grommet theme={THEMES.chainline}>
          <Switch>
            <Route exact={true} path='/' component={Home} />
            <Route exact={true} path='/new-demand' component={() => {}} />
            <Route exact={true} path='/new-travel' component={() => {}} />
            <Route exact={true} path='/track' component={() => {}} />
          </Switch>
        </Grommet>
      </Router>
    );
  }
}
