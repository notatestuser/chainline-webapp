import React, { Component } from 'react';
import { withRouter } from 'react-router';
import numeral from 'numeral';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Select, RoutedAnchor } from 'grommet';

import { getStats } from 'chainline-js';

import { WidthCappedContainer } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';


class TrackingPage extends Component {
  state = {}

  render() {
    return (
      <Box key='travel-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <Box>
              <Heading level={2} margin={{ top: 'none', bottom: 'medlarge' }}>
                Tracking in progress!
              </Heading>
            </Box>
          </WidthCappedContainer>
        </Box>
      </Box>);
  }
}

export default withBlockchainProvider(withRouter(TrackingPage));
