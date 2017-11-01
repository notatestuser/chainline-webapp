import React, { PureComponent } from 'react';
import numeral from 'numeral';
import is from 'is_js';
import { getAccountFromWIFKey, getBalance, getPrice } from 'chainline-js';

import { Box, Menu, Button } from 'grommet';
import { Alert, Money, LinkUp, LinkDown } from 'grommet-icons';
import styled from 'styled-components';

const REFRESH_INTERVAL_MS = 15000;

const DropDownLabel = styled(Box)`
  font-weight: 500;
`;

class WalletWidget extends PureComponent {
  state = {
    balance: null,
    gasPriceUSD: null,
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
    if (!this.props.accountWif) return; // not logged in
    if (this.state.accountWif === this.props.accountWif) return;
    this.setState({ accountWif: this.props.accountWif });
    const { address } = getAccountFromWIFKey(this.props.accountWif);
    const refresh = () => {
      console.debug('Refreshing wallet balance…');
      getBalance('TestNet', address)
        .then((balance) => {
          this.setState({ balance: balance.GAS.balance });
        });
      if (is.number(this.state.gasPriceUSD)) return;
      console.debug('Updating GAS/USD price…');
      getPrice('GAS')
        .then((gasPriceUSD) => {
          this.setState({ gasPriceUSD });
        });
    };
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(refresh, REFRESH_INTERVAL_MS); // every 15 secs
    refresh();
  }

  render() {
    const { balance, gasPriceUSD } = this.state;
    const {
      responsiveState,
      accountWif,
      onCreateWalletClick,
      onOpenWalletClick,
      onReceiveClick,
    } = this.props;

    // logged in?
    if (accountWif) {
      const sendWidget = responsiveState === 'wide' ? (<Button
        id='walletwidget-send'
        a11yTitle='Pay'
        onClick={() => {
          alert('Send clicked');
        }}
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
          { label: 'Reserved: 0 GAS' },
          { label: 'Send Money' },
          { label: 'Receive Money' }]}
      />);
      return [
        sendWidget,
        receiveWidget,
        walletWidget,
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
