import React, { PureComponent } from 'react';
import numeral from 'numeral';
import is from 'is_js';

import styled from 'styled-components';
import { Box, Menu, Button } from 'grommet';
import { Alert, Money, LinkUp, LinkDown } from 'grommet-icons';

import { getPrice, doSendAsset } from 'chainline-js';

import { SendLayer } from './';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const DropDownLabel = styled(Box)`
  font-weight: 500;
`;

class WalletWidget extends PureComponent {
  state = {
    gasPriceUSD: null,
    sendFundsOpen: false,
  }

  componentDidMount() {
    this._refreshGasPrice();
  }

  componentDidUpdate() {
    this._refreshGasPrice();
  }

  async _refreshGasPrice() {
    if (is.number(this.state.gasPriceUSD)) return;
    console.debug('Updating GAS/USD price…');
    const gasPriceUSD = await getPrice('GAS', 'USD');
    this.setState({ gasPriceUSD });
  }

  _onSendFunds = async (address, amount) => {
    const { onFundsSent, wallet: { wif: accountWif } } = this.props;
    const { result, hash } = await doSendAsset('TestNet', address, accountWif, { GAS: parseFloat(amount) });
    onFundsSent(result, hash);
  }

  render() {
    const {
      wallet: { address, wif, balance, effectiveBalanceString, reservedString, reputationString },
      responsiveState,
      onCreateWalletClick,
      onOpenWalletClick,
      onReceiveClick,
      onLogOutClick,
    } = this.props;
    const { gasPriceUSD } = this.state;

    // logged in?
    if (wif) {
      const sendWidget = responsiveState === 'wide' ? (<Button
        id='walletwidget-send'
        a11yTitle='Send'
        onClick={() => { this.setState({ sendFundsOpen: true }); }}
      >
        <Box align='start' direction='row' pad='small'>
          <DropDownLabel margin={{ right: 'small' }}>
            Send
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
          Balance: {effectiveBalanceString} GAS
          {is.number(gasPriceUSD) && typeof balance === 'number' ?
            ` ($${numeral(gasPriceUSD * balance).format('0,0.00')})` : ''}
        </DropDownLabel>}
        icon={<Money />}
        dropAlign={{ right: 'right', top: 'top' }}
        items={[
          { label: `Reserved: ${reservedString} GAS`,
            onClick: () => {},
            close: false },
          { label: `Your Reputation: ${reputationString}`,
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
        accountWif={wif}
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

export default withBlockchainProvider(WalletWidget);
