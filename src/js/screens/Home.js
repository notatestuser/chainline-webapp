import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getBalance } from 'chainline-js';

import { Box, Button, Grid, Heading } from 'grommet';

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
      <Grid
        rows={['xsmall', 'flex']}
        columns={['full']}
        areas={[
          { name: 'header', start: [0, 0], end: [0, 0] },
          { name: 'main', start: [0, 1], end: [0, 1] },
        ]}
      >
        <Box
          gridArea='header'
          direction='row'
          justify='between'
          align='center'
          background='brand'
          pad={{ horizontal: 'medium' }}
          animation='fadeIn'
        >
          <Heading margin='none'>Welcome</Heading>
          <Box margin='small'>
            <Button label='Login' primary={true} onClick={() => {}} />
          </Box>
        </Box>

        <Box gridArea='main' direction='row' wrap={true}>
          <Box
            align={'start'}
            pad='medium'
            basis={'medium'}
            animation={[
              { type: 'zoomIn', duration: 500, delay: 100 },
              { type: 'fadeIn', duration: 500, delay: 0 },
            ]}
          >
            <Heading level={2} margin={{ top: 'none' }}>
              <strong>Account Balance</strong>
            </Heading>
            <div>AenDCN3Xw3zXC5S5BNbEgT4UmDh6WPg8a1: {this.state.balance} GAS</div>
          </Box>
        </Box>
      </Grid>
    );
  }
}

Home.contextTypes = {
  router: PropTypes.any,
};
