import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import copy from 'copy-to-clipboard';
import secureRandom from 'secure-random';
import pEvent from 'p-event';

import styled from 'styled-components';
import { Grommet, Responsive, Box, Paragraph, Text, Anchor } from 'grommet';

import { getAccountFromWIFKey } from 'chainline-js';

import chainline from './themes/chainline';

import Layout from './Layout';
import HomePage from './screens/Home';
import DemandPage from './screens/Demand';
import TravelPage from './screens/Travel';

import WalletWorker from './workers/wallet.worker';

import {
  NotifyLayer,
  NotificationsWidget,
  WalletWidget,
  LoadWalletLayer,
  CreateWalletLayer,
} from './components';

const Boldish = styled.span`
  font-weight: 500;
  margin-bottom: 0;
`;
const KeyReadout = Boldish.withComponent(Paragraph);

const ReceiveParagraph = styled(Paragraph)`
  margin-top: 0;
`;

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

const MSG_LOGGED_IN = 'You are now logged in.';

const MSG_WALLET_CREATED = (caller, encryptedWif, copiedToClipboard) => [
  <Paragraph key='MSG_WALLET_CREATED-0' size='full' margin='none'>
    Your Wallet Key (WIF) is ready. Be sure to copy this somewhere safe.
  </Paragraph>,
  <Box key='MSG_WALLET_CREATED-1' margin={{ vertical: 'small', bottom: 'medium' }}>
    <KeyReadout size='full'>
      {encryptedWif}
    </KeyReadout>
    {!copiedToClipboard ? <Anchor
      onClick={() => {
        if (!copy(encryptedWif)) return;
        caller.setState({ notifyMessage: MSG_WALLET_CREATED(caller, encryptedWif, true) });
      }}
    >Copy it to your clipboard</Anchor> : null}
    {copiedToClipboard ? <Text>Copied to clipboard!</Text> : null}
  </Box>,
  <Paragraph key='MSG_WALLET_CREATED-2' size='full'>
    You will <Boldish>not</Boldish> be shown your Wallet Key (WIF) again after you click
    &ldquo;Okay&rdquo;.
  </Paragraph>,
  <Paragraph key='MSG_WALLET_CREATED-3' size='full' margin='none'>
    We recommend saving your key and passphrase in a secure password manager or
    on a piece of paper (paper wallet). Always follow&nbsp;
    <Anchor href='https://steemit.com/cryptocurrency/@kumablack/cryptocurrency-wallets-best-practices' target='_blank'>
      security best practices
    </Anchor>
    .
  </Paragraph>,
];

const MSG_RECEIVE = accountAddress => [
  <ReceiveParagraph key='MSG_RECEIVE-0' size='full' margin={{ bottom: 'small' }}>
    You may use this address to add funds to your wallet.
    Only GAS transactions are supported at this time; please do not send any other asset.
  </ReceiveParagraph>,
  <Box key='MSG_RECEIVE-1' margin={{ bottom: 'small' }}>
    <KeyReadout size='full'>
      {accountAddress}
    </KeyReadout>
  </Box>,
];

const MSG_FUNDS_SENT = txHash => [
  <Paragraph key='MSG_FUNDS_SENT-0' size='full' margin='none'>
    The funds are being sent. Balances will update shortly.
  </Paragraph>,
  <Anchor key='MSG_FUNDS_SENT-1' href={`https://neoscan-testnet.io/transaction/${txHash}`} target='_blank'>
    View the transaction (wait 1-2 mins.)
  </Anchor>,
];

const MSG_FUNDS_SEND_ERROR = 'Failed to send funds. Is that part of your balance reserved?';

export default class App extends Component {
  state = {
    responsiveState: 'wide',
    accountWif: null,
    notifyMessage: null,
    notifySuccess: true,
    notifyAutoClose: false,
    isCreateWalletLayerOpen: false,
    isLoadWalletLayerOpen: false,
  }

  constructor() {
    super();
    this.walletWorker = new WalletWorker();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  _onWalletCreate = async (passphrase) => {
    this.walletWorker.postMessage({
      operation: 'generateEncryptedWif',
      passphrase,
      privateKey: secureRandom(32), // must be done in the browser, fails in the worker
    });
    const { data: { wif, encryptedWif, error } } = await pEvent(this.walletWorker, 'message');
    if (error) {
      this.setState({ notifyMessage: error, notifySuccess: false, notifyAutoClose: false });
      return;
    }
    this.setState({
      accountWif: wif,
      notifyMessage: MSG_WALLET_CREATED(this, encryptedWif),
      notifyAutoClose: false,
    });
  }

  _onWalletLogin = async (encryptedWif, passphrase) => {
    this.walletWorker.postMessage({
      operation: 'decryptWif', encryptedWif, passphrase,
    });
    const { data: { wif, error } } = await pEvent(this.walletWorker, 'message');
    if (error || typeof wif !== 'string') {
      const notifyMessage = `Could not load that wallet. ${error || 'Invalid WIF.'}`;
      this.setState({ notifyMessage, notifySuccess: false, notifyAutoClose: false });
      return;
    }
    this.setState({
      accountWif: wif,
      notifyMessage: MSG_LOGGED_IN,
      notifyAutoClose: true,
      notifySuccess: true,
    });
  }

  _onWalletReceiveClick = () => {
    const { accountWif } = this.state;
    const { address } = getAccountFromWIFKey(accountWif);
    this.setState({
      notifyMessage: MSG_RECEIVE(address),
      notifySuccess: true,
    });
  }

  _onWalletFundsSent = (success, txHash) => {
    this.setState({
      notifyMessage: success ? MSG_FUNDS_SENT(txHash) : MSG_FUNDS_SEND_ERROR,
      notifySuccess: success,
    });
  }

  render() {
    const {
      responsiveState,
      notifyMessage,
      notifySuccess,
      notifyAutoClose,
      isCreateWalletLayerOpen,
      isLoadWalletLayerOpen,
    } = this.state;

    return (
      <Router history={history}>
        <Grommet theme={THEMES.chainline} centered={true}>
          {/* Responsive */}
          <Responsive onChange={this._onResponsiveChange}>
            {/* This must be here or it crashes :( */}
            <div />
          </Responsive>

          {/* Simple notifications */}
          {notifyMessage ? <NotifyLayer
            size='small'
            message={notifyMessage}
            isSuccess={notifySuccess}
            autoClose={notifyAutoClose}
            onClose={() => { this.setState({ notifyMessage: null, notifyAutoClose: false }); }}
          /> : null}

          {/* Layers (popups) */}
          {isCreateWalletLayerOpen &&
            <CreateWalletLayer
              onClose={() => this.setState({ isCreateWalletLayerOpen: false })}
              onCreate={this._onWalletCreate}
            />}
          {isLoadWalletLayerOpen &&
            <LoadWalletLayer
              onClose={() => this.setState({ isLoadWalletLayerOpen: false })}
              onLogin={this._onWalletLogin}
            />}

          {/* Page layout and routes */}
          <Layout
            responsiveState={responsiveState}
            headerWidgets={[
              <WalletWidget
                key='wallet'
                responsiveState={responsiveState}
                accountWif={this.state.accountWif}
                onCreateWalletClick={() => { this.setState({ isCreateWalletLayerOpen: true }); }}
                onOpenWalletClick={() => { this.setState({ isLoadWalletLayerOpen: true }); }}
                onReceiveClick={this._onWalletReceiveClick}
                onLogOutClick={() => { this.setState({ accountWif: null }); }}
                onFundsSent={this._onWalletFundsSent}
              />,
              <NotificationsWidget key='notifications' />,
            ]}
          >
            <Switch>
              <Route
                exact={true}
                path='/'
                render={routeProps => (
                  <HomePage
                    {...routeProps}
                    accountWif={this.state.accountWif}
                    responsiveState={responsiveState}
                  />)}
              />
              <Route
                exact={true}
                path='/demand/create'
                component={() =>
                  <DemandPage accountWif={this.state.accountWif} />}
              />
              <Route
                exact={true}
                path='/travel/create'
                component={() =>
                  <TravelPage accountWif={this.state.accountWif} />}
              />
              <Route exact={true} path='/track' component={() => {}} />
            </Switch>
          </Layout>
        </Grommet>
      </Router>
    );
  }
}
