import React, { Component } from 'react';
import numeral from 'numeral';
import is from 'is_js';
import { getAccountFromWIFKey, getBalance, getPrice } from 'chainline-js';

import { Box, Menu, Button } from 'grommet';
import { Alert, Money, LinkUp, LinkDown } from 'grommet-icons';
import styled from 'styled-components';

const DropDownLabel = styled(Box)`
  font-weight: 500;
`;

class WalletWidget extends Component {
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

  _refreshBalance() {
    if (!this.props.accountWif) return;
    if (this.state.accountWif === this.props.accountWif) return;
    this.setState({ accountWif: this.props.accountWif });
    const { address } = getAccountFromWIFKey(this.props.accountWif);
    getBalance('TestNet', address)
      .then((balance) => {
        this.setState({ balance: balance.GAS.balance });
      });
    getPrice('GAS')
      .then((gasPriceUSD) => {
        this.setState({ gasPriceUSD });
      });
  }

  render() {
    const { responsiveState, accountWif, onCreateWalletClick, onOpenWalletClick } = this.props;
    const { balance, gasPriceUSD } = this.state;

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
        onClick={() => {
          alert('Receive clicked');
        }}
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
          Balance: {is.number(balance) ? numeral(balance).format('0,0.00') : '?'} GAS
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
