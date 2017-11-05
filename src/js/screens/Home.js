import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Select, RoutedAnchor } from 'grommet';

import { getStats } from 'chainline-js';

import { WidthCappedContainer } from '../components';

const BlurbParagraph = styled(Paragraph)`
  margin-top: 0;
  padding-right: 12px;
`;

export default class Home extends Component {
  state = {
    hasStats: false,
    demands: 0,
    cities: 0,
    funds: 0,
  }

  async componentWillMount() {
    try {
      const { demands, cities, funds } = await getStats('TestNet');
      this.setState({
        hasStats: true,
        demands: Number.isNaN(parseInt(demands, 10)) ? 0 : demands,
        cities: Number.isNaN(parseInt(cities, 10)) ? 0 : cities,
        funds: Number.isNaN(parseInt(funds, 10)) ? 0 : funds,
      });
    } catch (e) {}  // eslint-disable-line
  }

  render() {
    const { responsiveState } = this.props;
    const { hasStats, demands, cities, funds } = this.state;

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
      hasStats && <Box key='content-1' background={{ dark: true, image: '#69B8D6' }} pad={{ bottom: 'large' }}>
        <WidthCappedContainer direction='row'>
          <Box basis='1/3' justify='center' align='center'>
            <Heading level={2} size='large' margin={{ bottom: 'medium' }}>
              {demands}
            </Heading>
            <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
              Demands
            </Heading>
          </Box>
          <Box basis='1/3' justify='center' align='center'>
            <Heading level={2} size='large' margin={{ bottom: 'medium' }}>
              {cities}
            </Heading>
            <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
              Cities
            </Heading>
          </Box>
          <Box basis='1/3' justify='center' align='center'>
            <Heading level={2} size='large' margin={{ bottom: 'medium' }}>
              {funds}
            </Heading>
            <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
              Reserved
            </Heading>
          </Box>
        </WidthCappedContainer>
      </Box>,
      <Box key='content-2'>
        <Box
          background='white'
          direction='row'
          align='center'
          pad='large'
        >
          <WidthCappedContainer direction='row' wrap='wrap'>
            <Box basis={responsiveState === 'wide' ? '1/3' : 'full'}>
              <Heading level={3} margin={{ top: responsiveState === 'wide' ? 'none' : undefined }}>
                How does Chain Line work?
              </Heading>
              <BlurbParagraph>
                Chain Line uses a network of untrusted peers to get products and valuable items to
                their destinations with near-zero risk.
              </BlurbParagraph>
              <BlurbParagraph>
                Behind Chain Line is a bold vision: to introduce a modern peer-to-peer courier
                platform to address the needs of shipping companies and individuals alike,
                powered entirely by a smart contract.
              </BlurbParagraph>
              <BlurbParagraph>
                Chain Line is a proof of concept app.
              </BlurbParagraph>
            </Box>

            <Box basis={responsiveState === 'wide' ? '1/3' : 'full'}>
              <Heading level={3} margin={{ top: responsiveState === 'wide' ? 'none' : undefined }}>
                &ldquo;Demand&rdquo; a shipment
              </Heading>
              <BlurbParagraph>
                Whether it&apos;s a new phone or a package from a friend, Chain Line can help
                transport the goods you need.
              </BlurbParagraph>
              <BlurbParagraph>
                Tell us which product you need and its origin city, and we will try to match you
                with someone travelling before your demand&apos;s expiry date.
              </BlurbParagraph>
              <Box margin={{ top: 'small' }}>
                <RoutedAnchor primary={true} path='/demand/create' label='Open a demand' />
              </Box>
            </Box>

            <Box basis={responsiveState === 'wide' ? '1/3' : 'full'}>
              <Heading level={3} margin={{ top: responsiveState === 'wide' ? 'none' : undefined }}>
                Tell us you&apos;re travelling
              </Heading>
              <BlurbParagraph>
                Have extra carry space and want to earn courier fees?
              </BlurbParagraph>
              <BlurbParagraph>
                Register your travel dates with Chain Line and we will try to match you up with
                someone looking to transport an item from the city you are visiting.
                Check back periodically to check your status.
              </BlurbParagraph>
              <Box margin={{ top: 'small' }}>
                <RoutedAnchor primary={true} path='/travel/create' label='Register your travel' />
              </Box>
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
