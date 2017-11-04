import React, { PureComponent } from 'react';
import numeral from 'numeral';
import is from 'is_js';
import { getAccountFromWIFKey, getBalance, getPrice, getReservedGasBalance, doSendAsset } from 'chainline-js';

import styled from 'styled-components';
import { Box, Menu, Button } from 'grommet';
import { Alert, Money, LinkUp, LinkDown } from 'grommet-icons';
import { SendLayer } from './';

const REFRESH_INTERVAL_MS = 15000;

const DropDownLabel = styled(Box)`
  font-weight: 500;
`;

class WalletWidget extends PureComponent {
  state = {
    balance: null,
    gasPriceUSD: null,
    sendFundsOpen: false,
  }

  componentDidMount() {
    this._refreshBalance();
  }

  componentDidUpdate() {
    this._refreshBalance();
  }

  componentWillUnmount() {
    if (!this._timer) return;
    clearInterval(this._timer);
  }

  _refreshBalance() {
    const { accountWif } = this.props;
    if (!accountWif) return; // not logged in
    if (this.state.accountWif === accountWif) return;
    const { address } = getAccountFromWIFKey(accountWif);
    this.setState({ accountWif, address });
    const refresh = async () => {
      console.debug('Refreshing wallet status…');
      // in parallel, fail safe
      getBalance('TestNet', address).then((balance) => {
        this.setState({ balance: balance.GAS.balance });
      });
      getReservedGasBalance('TestNet', accountWif).then((reserved) => {
        this.setState({ reserved: reserved.reservedBalance });
      });
      if (is.number(this.state.gasPriceUSD)) return;
      console.debug('Updating GAS/USD price…');
      const gasPriceUSD = await getPrice('GAS');
      this.setState({ gasPriceUSD });
    };
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(refresh, REFRESH_INTERVAL_MS); // every 15 secs
    refresh();
  }

  _onSendFunds = async (address, amount) => {
    const { onFundsSent } = this.props;
    const { accountWif } = this.state;
    const { result, hash } = await doSendAsset('TestNet', address, accountWif, { GAS: parseFloat(amount) });
    onFundsSent(result, hash);
  }

  render() {
    const {
      responsiveState,
      accountWif,
      onCreateWalletClick,
      onOpenWalletClick,
      onReceiveClick,
      onLogOutClick,
    } = this.props;
    const { balance, reserved, gasPriceUSD, address } = this.state;

    // logged in?
    if (accountWif) {
      const sendWidget = responsiveState === 'wide' ? (<Button
        id='walletwidget-send'
        a11yTitle='Pay'
        onClick={() => { this.setState({ sendFundsOpen: true }); }}
      >
        <Box align='start' direction='row' pad='small'>
          <DropDownLabel margin={{ right: 'small' }}>
            Pay
          </DropDownLabel>
          <LinkUp />
        </Box>
      </Button>) : null;

      const receiveWidget = responsiveState === 'wide' ? (<Button
        id='walletwidget-receive'
        a11yTitle='Receive'
        onClick={() => { onReceiveClick(); }}
      >
        <Box align='start' direction='row' pad='small'>
          <DropDownLabel margin={{ right: 'small' }}>
            Receive
          </DropDownLabel>
          <LinkDown />
        </Box>
      </Button>) : null;

      const walletWidget = (<Menu
        key='walletwidget-wallet'
        background='neutral-5'
        full='grow'
        label={<DropDownLabel>
          Balance: {is.number(balance) ? numeral(balance).format('0,0.000') : '?'} GAS
          {is.number(gasPriceUSD) && typeof balance === 'number' ?
            ` ($${numeral(gasPriceUSD * balance).format('0,0.00')})` : ''}
        </DropDownLabel>}
        icon={<Money />}
        dropAlign={{ right: 'right', top: 'top' }}
        items={[
          { label: `Reserved: ${is.number(reserved) ? reserved : 0} GAS`,
            onClick: () => {},
            close: false },
          { label: 'Transactions',
            onClick: is.number(balance) && balance > 0 ? () => {
              window.open(`https://neoscan-testnet.io/address/${address}`);
            } : undefined },
          { label: 'Log out',
            onClick: () => { onLogOutClick(); } }]}
      />);

      const sendLayer = this.state.sendFundsOpen ? (<SendLayer
        balance={balance}
        accountWif={accountWif}
        onClose={() => { this.setState({ sendFundsOpen: false }); }}
        onSendFunds={this._onSendFunds}
      />) : null;

      return [
        sendWidget,
        receiveWidget,
        walletWidget,
        sendLayer,
      ];
    }

    // not logged in
    return (<Menu
      background='neutral-5'
      full='grow'
      label={<DropDownLabel>You are not logged in!</DropDownLabel>}
      icon={<Alert />}
      dropAlign={{ right: 'right', top: 'top' }}
      items={[
        { label: 'Create a new wallet', onClick: () => onCreateWalletClick() },
        { label: 'Load an existing wallet', onClick: () => onOpenWalletClick() }]}
    />);
  }
}

export default WalletWidget;
