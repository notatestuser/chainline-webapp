import React, { Component } from 'react';  // eslint-disable-line
import PropTypes from 'prop-types';
import numeral from 'numeral';
import is from 'is_js';
import { getAccountFromWIFKey, getBalance, getWalletState } from 'chainline-js';

const REFRESH_INTERVAL_MS = 15000;
const NUMBER_FORMAT = '0,0.000';

export const contextTypes = {
  wallet: PropTypes.shape({
    address: PropTypes.string,
    balance: PropTypes.number,
    balanceString: PropTypes.string,
    isLoaded: PropTypes.bool,
    reserved: PropTypes.number,
    reservedString: PropTypes.string,
    wif: PropTypes.string,
  }),
};

const defaultState = {
  balance: null,
  reserved: null,
  wif: null,
};

class WalletProvider extends Component {
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
    const { wif, balance, reserved, reputation } = this.state;
    const { net } = this.props;
    let address = null;
    if (wif) address = getAccountFromWIFKey(wif).address;
    return {
      wallet: {
        address,
        balance,
        balanceString: is.number(balance) ? numeral(balance).format(NUMBER_FORMAT) : '?',
        isLoaded: !!wif,
        reputation,
        reputationString: is.number(reputation) ? numeral(reputation).format('0,0') : '?',
        reserved,
        reservedString: is.number(reserved) ? numeral(reserved).format(NUMBER_FORMAT) : '?',
        net,
        wif,
      },
    };
  }

  _refreshState() {
    const { net, wif } = this.props;
    if (!wif && this.state.wif) {
      // not logged in / user logged out
      this.setState(defaultState);
    }
    if (!wif) return;
    if (this.state.wif === wif) return;
    const { address, programHash } = getAccountFromWIFKey(wif);
    this.setState({ wif, address });
    const refresh = async () => {
      console.debug('Refreshing wallet status…');
      // in parallel, fail-safe
      getBalance(net, address).then((response) => {
        const { reserved } = this.state;
        const newBalance = response.GAS.balance;
        this.setState({
          balance: reserved ? newBalance - reserved : newBalance,
        });
      });
      getWalletState(net, wif, programHash).then((response) => {
        const { balance } = this.state;
        const { reservedBalance, reputation } = response;
        this.setState({
          reserved: reservedBalance,
          balance: balance - reservedBalance,
          reputation,
        });
      });
    };
    if (this._timer) clearInterval(this._timer);
    this._timer = setInterval(refresh, REFRESH_INTERVAL_MS); // every 15 secs
    refresh();
  }

  render() { return this.props.children; }
}

export default WalletProvider;
