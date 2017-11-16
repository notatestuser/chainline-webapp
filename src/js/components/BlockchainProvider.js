import React, { Component } from 'react';  // eslint-disable-line
import PropTypes from 'prop-types';
import numeral from 'numeral';
import is from 'is_js';
import {
  getAccountFromWIFKey,
  getBalance,
  getPrice,
  getWalletState,
} from 'chainline-js';

const REFRESH_INTERVAL_MS = 15000;
const NUMBER_FORMAT = '0,0.000';

export const contextTypes = {
  gasPriceUSD: PropTypes.number,
  wallet: PropTypes.shape({
    address: PropTypes.string,
    balance: PropTypes.number,
    balanceString: PropTypes.string,
    effectiveBalance: PropTypes.number,
    effectiveBalanceString: PropTypes.string,
    isLoaded: PropTypes.bool,
    reserved: PropTypes.number,
    reservedString: PropTypes.string,
    wif: PropTypes.string,
  }),
};

const defaultState = {
  balance: null,
  originalBalance: 0,
  reserved: null,
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
        balanceString: is.number(balance) ? numeral(balance).format(NUMBER_FORMAT) : '?',
        effectiveBalance,
        effectiveBalanceString: is.number(effectiveBalance) ? numeral(effectiveBalance).format(NUMBER_FORMAT) : '?',
        isLoaded: !!wif,
        net,
        programHash,
        reputation,
        reputationString: is.number(reputation) ? numeral(reputation).format('0,0') : '?',
        reserved,
        reservedString: is.number(reserved) ? numeral(reserved).format(NUMBER_FORMAT) : '?',
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
      alert('Unable to retrieve the current GAS price in USD. This is bad, things will be broken!');
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
      getBalance(net, address, true).then((response) => {
        const { reserved } = this.state;
        const newBalance = response.GAS.balance;
        this.setState({
          originalBalance: newBalance,
          balance: reserved ? newBalance - reserved : newBalance,
        });
      }).catch((err) => {
        const { message } = err;
        alert(`Could not get wallet balance! ${message}`);
        console.error('getBalance error', err);
      });
      getWalletState(net, wif, programHash).then((response) => {
        const { originalBalance } = this.state;
        const { reservedBalance, reputation, stateLookupKey } = response;
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
