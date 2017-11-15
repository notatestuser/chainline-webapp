import React, { Component } from 'react';

import { contextTypes } from '../components/BlockchainProvider';

const withBlockchainProvider = ChildComponent =>
  class extends Component {
    static contextTypes = contextTypes

    render() {
      const { props, context } = this;
      return (<ChildComponent
        {...props}
        wallet={context.wallet}
        gasPriceUSD={context.gasPriceUSD}
      />);
    }
  };

export default withBlockchainProvider;
