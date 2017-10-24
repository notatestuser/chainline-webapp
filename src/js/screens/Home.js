import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Heading } from 'grommet';

import { getBalance } from 'chainline-js';

import { Box, WidthCappedContainer } from '../components';

export default class Home extends Component {
  state = {}

  componentDidMount() {
    getBalance('TestNet', 'AenDCN3Xw3zXC5S5BNbEgT4UmDh6WPg8a1')
      .then((balance) => {
        this.setState({ balance: balance.GAS.balance });
      });
  }

  render() {
    return (
      <Box direction='column'>
        <Box
          background='white'
          direction='column'
          justify='center'
          responsive={true}
          pad='large'
        >
          <WidthCappedContainer size='xlarge'>
            <Heading level={2} margin={{ top: 'none' }}>
              <strong>Account Balance</strong>
            </Heading>

            <div>AenDCN3Xw3zXC5S5BNbEgT4UmDh6WPg8a1: {this.state.balance} GAS</div>
          </WidthCappedContainer>
        </Box>
      </Box>
    );
  }
}

Home.contextTypes = {
  router: PropTypes.any,
};
