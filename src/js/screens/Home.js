import React, { Component } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import is from 'is_js';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Select, RoutedAnchor } from 'grommet';

import { getPrice, getStats } from 'chainline-js';

import { WidthCappedContainer } from '../components';

const BlurbParagraph = styled(Paragraph)`
  margin-top: 0;
  padding-right: 12px;
`;

export default class Home extends Component {
  state = {
    hasStats: false,
    gasPriceUSD: null,
    demands: 0,
    routes: 0,
    funds: 0,
  }

  async componentWillMount() {
    try {
      const { demands, routes, funds } = await getStats('TestNet');
      this.setState({
        hasStats: true,
        demands: Number.isNaN(parseInt(demands, 10)) ? 0 : demands,
        routes: Number.isNaN(parseInt(routes, 10)) ? 0 : routes,
        funds: Number.isNaN(parseInt(funds, 10)) ? 0 : funds,
      });
      this._refreshGasPrice();
    } catch (e) {}  // eslint-disable-line
  }

  componentDidUpdate() {
    this._refreshGasPrice();
  }

  async _refreshGasPrice() {
    if (is.number(this.state.gasPriceUSD)) return;
    console.debug('Updating GAS/USD price…');
    const gasPriceUSD = await getPrice('GAS', 'USD');
    this.setState({ gasPriceUSD });
  }

  render() {
    const { responsiveState } = this.props;
    const { hasStats, gasPriceUSD, demands, routes, funds } = this.state;

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
                'I would like an item to be delivered to me from another city.',
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
              {routes}
            </Heading>
            <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
              Routes
            </Heading>
          </Box>
          {gasPriceUSD ? <Box basis='1/3' justify='center' align='center'>
            <Heading level={2} size='large' margin={{ bottom: 'medium' }}>
              ${numeral(funds * gasPriceUSD).format('0,0')}
            </Heading>
            <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
              Reserved
            </Heading>
          </Box> : null}
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
                platform to address the needs of modern shipping companies and individuals alike.
              </BlurbParagraph>
              <BlurbParagraph>
                Chain Line is a functional demo powered entirely by a blockchain smart contract.
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
                <RoutedAnchor primary={true} path='/demand/create' label='Demand a shipment' />
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
