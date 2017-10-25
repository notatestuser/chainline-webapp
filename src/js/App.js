import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { Grommet, Responsive } from 'grommet';

import chainline from './themes/chainline';

import Layout from './Layout';
import HomePage from './screens/Home';
import DemandPage from './screens/Demand';

import {
  NotificationsWidget,
  WalletWidget,
  LoadWalletLayer,
  LoggedInMsgLayer,
} from './components';

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

export default class App extends Component {
  state = {
    responsiveState: 'wide',
    accountWif: null,
    isLoadWalletLayerOpen: false,
    isLoggedInLayerOpen: false,
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
          {/* Responsive */}
          <Responsive onChange={this.onResponsiveChange}>
            {/* This must be here or it crashes :( */}
            <div />
          </Responsive>

          {/* Layers (popups) */}
          {this.state.isLoadWalletLayerOpen &&
            <LoadWalletLayer
              onClose={() => this.setState({ isLoadWalletLayerOpen: false })}
              onLogin={(accountWif) => {
                this.setState({ accountWif, isLoggedInLayerOpen: true });
              }}
            />}
          {this.state.isLoggedInLayerOpen &&
            <LoggedInMsgLayer
              onClose={() => this.setState({ isLoggedInLayerOpen: false })}
            />}

          {/* Page layout and routes */}
          <Layout
            responsiveState={responsiveState}
            headerWidgets={[
              <WalletWidget
                responsiveState={responsiveState}
                accountWif={this.state.accountWif}
                onOpenWalletClick={() => { this.setState({ isLoadWalletLayerOpen: true }); }}
              />,
              <NotificationsWidget />,
            ]}
          >
            <Switch>
              <Route
                exact={true}
                path='/'
                render={routeProps =>
                  <HomePage {...routeProps} accountWif={this.state.accountWif} />}
              />
              <Route exact={true} path='/demand/create' component={DemandPage} />
              <Route exact={true} path='/new-travel' component={() => {}} />
              <Route exact={true} path='/track' component={() => {}} />
            </Switch>
          </Layout>
        </Grommet>
      </Router>
    );
  }
}
