import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Heading } from 'grommet';

import { WidthCappedContainer } from '../components';

export default class Home extends Component {
  state = {
    balance: 'unknown',
  }

  componentDidMount() {
    // getBalance('TestNet', 'AenDCN3Xw3zXC5S5BNbEgT4UmDh6WPg8a1')
    //   .then((balance) => {
    //     this.setState({ balance: balance.GAS.balance });
    //   });
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
          <WidthCappedContainer>
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
