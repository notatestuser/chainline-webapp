import React, { PureComponent } from 'react';
import numeral from 'numeral';
import is from 'is_js';

import styled from 'styled-components';
import { Box, Menu, Button } from 'grommet';
import { StatusInfo, Money, LinkUp, LinkDown } from 'grommet-icons';

import { doSendAsset } from 'chainline-js';

import { SendLayer } from './';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const DropDownLabel = styled(Box)` font-weight: 500; `;

class WalletWidget extends PureComponent {
  state = {
    sendFundsOpen: false,
  }

  _onSendFunds = async (address, amount) => {
    const { onFundsSent, wallet: { wif: accountWif, net } } = this.props;
    const safeAmount = parseFloat(parseFloat(amount).toFixed(8));
    console.info('Sending GAS', address, safeAmount);
    const { result, hash } = await doSendAsset(net, address, accountWif, { GAS: safeAmount });
    onFundsSent(result, hash);
  }

  render() {
    const {
      wallet: { address, wif, balance, effectiveBalanceString, reservedString, reputationString },
      gasPriceUSD,
      responsiveState,
      onCreateWalletClick,
      onOpenWalletClick,
      onReceiveClick,
      onLogOutClick,
    } = this.props;

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
          {is.number(gasPriceUSD) && typeof balance === 'number' && balance > 0.0001 ?
            ` ($${numeral(gasPriceUSD * balance).format('0,0.00')})` : ' ($0.00)'}
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
      label={<DropDownLabel>
        Log in to start using Chain Line
      </DropDownLabel>}
      icon={<StatusInfo />}
      dropAlign={{ right: 'right', top: 'top' }}
      items={[
        { label: 'Create a new wallet', onClick: () => onCreateWalletClick() },
        { label: 'Load an existing wallet', onClick: () => onOpenWalletClick() }]}
    />);
  }
}

export default withBlockchainProvider(WalletWidget);
