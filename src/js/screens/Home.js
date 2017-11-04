import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Paragraph, Select, RoutedAnchor } from 'grommet';

import { WidthCappedContainer } from '../components';

export default class Home extends Component {
  render() {
    return ([
      <Box key='content-0' direction='column'>
        <Box
          background='white'
          direction='column'
          justify='center'
          responsive={true}
          pad='large'
        >
          <WidthCappedContainer>
            <Heading level={3} margin={{ top: 'none' }}>
              What can Chain Line do for you?
            </Heading>

            <Select
              size='large'
              options={[
                'I would like an item to be delivered to me from overseas.',
                'I am travelling and have extra space to carry items.',
                'There is a Chain Line shipment I would like to track.',
              ]}
              value='Select one'
            />
          </WidthCappedContainer>
        </Box>
      </Box>,
      // <Box key='content-1' background={{ dark: true, image: '#69B8D6' }}>
      //   <Grid background={{ dark: true }}>
      //     <Text>
      //   </Grid>
      // </Box>,
      <Box key='content-2'>
        <Box
          direction='row'
          align='center'
          pad='large'
        >
          <WidthCappedContainer direction='column'>
            <Heading level={3} margin={{ top: 'none' }}>
              How does the Chain Line work?
            </Heading>

            <Paragraph>
              Lorem ipsum whatever dorem lorem ipsum whatever dorem lorem ipsum whatever dorem lorem
              ipsum whatever dorem lorem ipsum whatever dorem lorem ipsum whatever dorem lorem ipsum
              whatever dorem lorem ipsum whatever dorem lorem ipsum whatever dorem lorem ipsum what
              dorem lorem ipsum whatever dorem lorem
            </Paragraph>

            <Box margin={{ top: 'medium' }}>
              <RoutedAnchor primary={true} path='/demand/create' label='Create a Demand' />
            </Box>

          </WidthCappedContainer>
        </Box>
      </Box>,
    ]);
  }
}

Home.contextTypes = {
  router: PropTypes.any,
};
