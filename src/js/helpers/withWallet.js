import React, { Component } from 'react';

import { contextTypes } from '../components/WalletProvider';

const withWallet = ChildComponent =>
  class extends Component {
    static contextTypes = contextTypes

    render() {
      const { props, context } = this;
      return <ChildComponent {...props} wallet={context.wallet} />;
    }
  };

export default withWallet;
