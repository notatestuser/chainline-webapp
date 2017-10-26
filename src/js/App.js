import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { Grommet, Responsive } from 'grommet';

import chainline from './themes/chainline';

import Layout from './Layout';
import HomePage from './screens/Home';
import DemandPage from './screens/Demand';

import {
  NotifyLayer,
  NotificationsWidget,
  WalletWidget,
  LoadWalletLayer,
} from './components';

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

const MSG_LOGGED_IN = 'You are now logged in.';

export default class App extends Component {
  state = {
    responsiveState: 'wide',
    accountWif: null,
    notifyMessage: null,
    notifySuccess: false,
    notifyAutoClose: true,
    isLoadWalletLayerOpen: false,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  render() {
    const {
      responsiveState,
      notifyMessage,
      notifySuccess,
      notifyAutoClose,
    } = this.state;

    return (
      <Router history={history}>
        <Grommet theme={THEMES.chainline} centered={true}>
          {/* Responsive */}
          <Responsive onChange={this.onResponsiveChange}>
            {/* This must be here or it crashes :( */}
            <div />
          </Responsive>

          {/* Simple notifications */}
          {notifyMessage ? <NotifyLayer
            size='small'
            message={notifyMessage}
            isSuccess={notifySuccess}
            autoClose={notifyAutoClose}
            onClose={() => { this.setState({ notifyMessage: null }); }}
          /> : null}

          {/* Layers (popups) */}
          {this.state.isLoadWalletLayerOpen &&
            <LoadWalletLayer
              onClose={() => this.setState({ isLoadWalletLayerOpen: false })}
              onLogin={(accountWif) => {
                this.setState({ accountWif, notifyMessage: MSG_LOGGED_IN, notifySuccess: true });
              }}
            />}

          {/* Page layout and routes */}
          <Layout
            responsiveState={responsiveState}
            headerWidgets={[
              <WalletWidget
                key='wallet'
                responsiveState={responsiveState}
                accountWif={this.state.accountWif}
                onOpenWalletClick={() => { this.setState({ isLoadWalletLayerOpen: true }); }}
              />,
              <NotificationsWidget key='notifications' />,
            ]}
          >
            <Switch>
              <Route
                exact={true}
                path='/'
                render={routeProps =>
                  <HomePage {...routeProps} accountWif={this.state.accountWif} />}
              />
              <Route
                exact={true}
                path='/demand/create'
                component={() =>
                  <DemandPage accountWif={this.state.accountWif} />}
              />
              <Route exact={true} path='/new-travel' component={() => {}} />
              <Route exact={true} path='/track' component={() => {}} />
            </Switch>
          </Layout>
        </Grommet>
      </Router>
    );
  }
}
