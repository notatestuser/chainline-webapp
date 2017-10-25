import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';

import { WidthCappedContainer } from '../components';

export default class DemandPage extends Component {
  render() {
    return (
      <Box direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <p>Demand Screen</p>
          </WidthCappedContainer>
        </Box>
      </Box>
    );
  }
}

DemandPage.contextTypes = {
  router: PropTypes.any,
};
