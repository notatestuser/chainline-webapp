import React, { Component } from 'react';
import numeral from 'numeral';
import is from 'is_js';

import { Box, Menu, Button } from 'grommet';
import { Alert, Money, LinkUp, LinkDown } from 'grommet-icons';

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
    const { responsiveState, accountWif, onOpenWalletClick } = this.props;
    const { balance, gasPriceUSD } = this.state;

    // logged in?
    if (accountWif) {
      const sendWidget = responsiveState === 'wide' ? (<Button
        id='widget-send'
        a11yTitle='Pay'
        onClick={() => {
          alert('Send clicked');
        }}
      >
        <Box align='start' direction='row' pad='small'>
          <Box margin={{ right: 'small' }}>
            <strong>
              Pay
            </strong>
          </Box>
          <LinkUp />
        </Box>
      </Button>) : null;

      const receiveWidget = responsiveState === 'wide' ? (<Button
        id='widget-receive'
        a11yTitle='Receive'
        onClick={() => {
          alert('Receive clicked');
        }}
      >
        <Box align='start' direction='row' pad='small'>
          <Box margin={{ right: 'small' }}>
            <strong>
              Receive
            </strong>
          </Box>
          <LinkDown />
        </Box>
      </Button>) : null;

      const walletWidget = (<Menu
        key='widget-wallet'
        background='neutral-5'
        full='grow'
        label={<strong>
          Balance: {is.number(balance) ? numeral(balance).format('0,0.00') : '?'} GAS
          {is.number(gasPriceUSD) && typeof balance === 'number' ?
            ` ($${numeral(gasPriceUSD * balance).format('0,0.00')})` : ''}
        </strong>}
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
