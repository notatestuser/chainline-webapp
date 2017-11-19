import React, { Component } from 'react';  // eslint-disable-line
import PropTypes from 'prop-types';
import numeral from 'numeral';
import is from 'is_js';
import unfetch from 'isomorphic-unfetch';

import {
  getAccountFromWIFKey,
  getPrice,
  getWalletState,
} from 'chainline-js';

const CHAINLINE_BALANCE_API = 'https://chainline.co/api/balance/';
const REFRESH_INTERVAL_MS = 15000;
const BALANCE_FORMAT = '0,0.0000';

export const contextTypes = {
  gasPriceUSD: PropTypes.number,
  wallet: PropTypes.shape({
    address: PropTypes.string,
    balance: PropTypes.number,
    balanceString: PropTypes.string,
    effectiveBalance: PropTypes.number,
    effectiveBalanceString: PropTypes.string,
    isLoaded: PropTypes.bool,
    programHash: PropTypes.string,
    reserved: PropTypes.number,
    reservedString: PropTypes.string,
    wif: PropTypes.string,
  }),
};

const defaultState = {
  balance: 0,
  originalBalance: 0,
  reserved: 0,
  reputation: 0,
  wif: null,
};

class BlockchainProvider extends Component {
  static childContextTypes = contextTypes

  state = defaultState

  componentDidMount() {
    this._refreshState();
  }

  componentDidUpdate() {
    this._refreshState();
  }

  componentWillUnmount() {
    if (!this._timer) return;
    clearInterval(this._timer);
  }


  getChildContext() {
    const { address, programHash, wif, balance, reserved, reputation, stateLookupKey, gasPriceUSD } = this.state;
    const { net } = this.props;
    const effectiveBalance = balance;
    return {
      gasPriceUSD,
      wallet: {
        address,
        balance,
        balanceString: is.number(balance) && balance > 0.0001 ? numeral(balance).format(BALANCE_FORMAT) : '0.0000',
        effectiveBalance,
        effectiveBalanceString: is.number(effectiveBalance) && balance > 0.0001 ? numeral(effectiveBalance).format(BALANCE_FORMAT) : '0.0000',
        isLoaded: !!wif,
        net,
        programHash,
        reputation,
        reputationString: is.number(reputation) ? numeral(reputation).format('0,0') : '?',
        reserved,
        reservedString: is.number(reserved) ? numeral(reserved).format(BALANCE_FORMAT) : '?',
        stateLookupKey,
        wif,
      },
    };
  }

  _refreshGasPriceUSD = async () => {
    console.debug('Updating GAS/USD price…');
    try {
      const gasPriceUSD = await getPrice('GAS', 'USD');
      this.setState({ gasPriceUSD });
    } catch (e) {
      console.error('Unable to retrieve the current GAS price in USD. This is bad, things will be broken!');
    }
  }

  _refreshState() {
    const { net, wif } = this.props;
    if (!wif && this.state.wif) {
      // not logged in / user logged out
      this.setState(defaultState);
    }
    if (!this.state.gasPriceUSD) this._refreshGasPriceUSD();
    if (!wif) return;
    if (this.state.wif === wif) return;
    const { address, programHash } = getAccountFromWIFKey(wif);
    this.setState({ wif, address, programHash });
    const refresh = async () => {
      console.debug('Refreshing wallet state…');
      // in parallel, fail-safe
      const res = await unfetch(`${CHAINLINE_BALANCE_API}${address}`);
      if (res.ok) {
        const { reserved } = this.state;
        const { balance: newBalance } = await res.json();
        // avoid unnecessary state updates
        if (newBalance !== this.state.originalBalance) {
          this.setState({
            originalBalance: newBalance,
            balance: reserved ? newBalance - reserved : newBalance,
          });
        }
      } else {
        const message = res.statusText;
        console.error(`Could not get wallet balance! ${message}`);
      }
      getWalletState(net, wif, programHash).then((response) => {
        const { originalBalance } = this.state;
        const { reservedBalance, reputation, stateLookupKey } = response;
        // avoid unnecessary state updates
        if (reservedBalance === this.state.reserved &&
            stateLookupKey === this.state.stateLookupKey &&
            reputation === this.state.reputation) return;
        this.setState({
          reserved: reservedBalance,
          balance: originalBalance - reservedBalance,
          reputation,
          stateLookupKey,
        });
      }).catch((err) => {
        const { message } = err;
        alert(`Could not get wallet state! ${message}`);
        console.error('getWalletState error', err);
      });
    };
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(refresh, REFRESH_INTERVAL_MS); // every 15 secs
    refresh();
  }

  render() {
    return this.props.children;
  }
}

export default BlockchainProvider;
