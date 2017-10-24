import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { createBrowserHistory } from 'history';

import { Grommet, Responsive } from 'grommet';

import chainline from './themes/chainline';
import Layout from './Layout';
import Home from './screens/Home';

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

export default class App extends Component {
  state = {
    responsiveState: 'wide',
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  render() {
    const { responsiveState } = this.state;

    return (
      <Router history={history}>
        <Grommet theme={THEMES.chainline} centered={true}>
          <Responsive onChange={this.onResponsiveChange}>
            {/* This must be here or it crashes :( */}
            <div />
          </Responsive>
          <Layout responsiveState={responsiveState}>
            <Switch>
              <Route exact={true} path='/' component={Home} />
              <Route exact={true} path='/new-demand' component={() => {}} />
              <Route exact={true} path='/new-travel' component={() => {}} />
              <Route exact={true} path='/track' component={() => {}} />
            </Switch>
          </Layout>
        </Grommet>
      </Router>
    );
  }
}
