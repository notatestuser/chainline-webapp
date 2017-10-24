import React, { Component } from 'react';
import numeral from 'numeral';

import { Menu } from 'grommet';
import { Money, Alert } from 'grommet-icons';

import { getBalance, getPrice } from 'chainline-js';

class WalletWidget extends Component {
  state = {
    balance: null,
    gasPriceUSD: null,
  }

  componentDidMount() {
    getBalance('TestNet', 'AenDCN3Xw3zXC5S5BNbEgT4UmDh6WPg8a1')
      .then((balance) => {
        this.setState({ balance: balance.GAS.balance });
      });
    getPrice('GAS')
      .then((gasPriceUSD) => {
        this.setState({ gasPriceUSD });
      });
  }

  render() {
    const { accountWif, onOpenWalletClick } = this.props;
    const { balance, gasPriceUSD } = this.state;

    if (accountWif) {
      // logged in
      return (<Menu
        background='neutral-5'
        full='grow'
        label={<strong>
          Wallet Balance: {typeof balance === 'number' ?
            numeral(balance).format('0,0.00') : '?'} GAS
          {typeof gasPriceUSD === 'number' && typeof balance === 'number' ?
            ` ($${numeral(gasPriceUSD * balance).format('0,0.00')})` : ''}
        </strong>}
        icon={<Money />}
        dropAlign={{ right: 'right', top: 'top' }}
        items={[
          { label: 'Reserved: 0 GAS' },
          { label: 'Send Money' },
          { label: 'Receive Money' }]}
      />);
    }
    // not logged in
    return (<Menu
      background='neutral-5'
      full='grow'
      label={<strong>You are not logged in!</strong>}
      icon={<Alert />}
      dropAlign={{ right: 'right', top: 'top' }}
      items={[
        { label: 'Create a new wallet' },
        { label: 'Load a wallet', onClick: () => onOpenWalletClick() }]}
    />);
  }
}

export default WalletWidget;
