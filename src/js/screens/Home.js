import React, { Component } from 'react';
import { withRouter } from 'react-router';
import numeral from 'numeral';

import { Box, Heading, Select, RoutedAnchor } from 'grommet';

import { getStats } from 'chainline-js';

import { WidthCappedContainer } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';
import {
  WhiteSection,
  StatsHeading,
  StatsInnerBox,
  BlurbParagraph,
  BlurbPoints,
  StatsBox,
  StatNumber,
  BlurbsContainer,
} from '../styles';

const DROPDOWN_OPTIONS = {
  'I have extra space to carry items during my travel to another city.': '/travel/create',
  'I would like an item to be collected and delivered to me.': '/demand/create',
  'There is a Chain Line shipment I would like to track.': 'TRACK',
};

class Home extends Component {
  state = {
    hasStats: false,
    demands: 0,
    routes: 0,
    funds: 0,
  }

  async componentWillMount() {
    const { wallet: { net } } = this.props;
    try {
      const { demands, routes, funds } = await getStats(net);
      this.setState({
        hasStats: true,
        demands: Number.isNaN(parseInt(demands, 10)) ? 0 : demands,
        routes: Number.isNaN(parseInt(routes, 10)) ? 0 : routes,
        funds: Number.isNaN(parseInt(funds, 10)) ? 0 : funds,
      });
    } catch (e) {}  // eslint-disable-line
  }

  render() {
    const { responsiveState, gasPriceUSD } = this.props;
    const { hasStats, demands, routes, funds } = this.state;

    return ([
      <Box key='content-0' direction='column'>
        <WhiteSection
          background='white'
          direction='column'
          justify='center'
          responsive={true}
          pad='large'
        >
          <WidthCappedContainer>
            <Heading level={3} margin={{ top: 'none' }}>
              Begin your journey
            </Heading>
            <Select
              size='large'
              options={Object.keys(DROPDOWN_OPTIONS)}
              value='Choose what best describes you'
              onChange={({ option }) => {
                if (DROPDOWN_OPTIONS[option] === 'TRACK') {
                  this.props.onTrackClicked();
                  return;
                }
                this.props.history.push(DROPDOWN_OPTIONS[option]);
              }}
            />
          </WidthCappedContainer>
        </WhiteSection>
      </Box>,
      hasStats && <StatsBox
        key='content-1'
        background={{ dark: true, image: '#69B8D6' }}
        pad={{ bottom: 'large' }}
        animation={[
          { type: 'zoomIn', duration: 500, delay: 0 },
          { type: 'fadeIn', duration: 500, delay: 0 },
        ]}
      >
        <WidthCappedContainer direction='column'>
          <StatsHeading>
            System Statistics
          </StatsHeading>
          <StatsInnerBox direction='row'>
            <Box basis='1/3' justify='center' align='center'>
              <StatNumber level={2} size='large' margin={{ top: 'none', bottom: 'medium' }}>
                {demands}
              </StatNumber>
              <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
                Demands
              </Heading>
            </Box>
            <Box basis='1/3' justify='center' align='center'>
              <StatNumber level={2} size='large' margin={{ top: 'none', bottom: 'medium' }}>
                {routes}
              </StatNumber>
              <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
                Routes
              </Heading>
            </Box>
            {gasPriceUSD && responsiveState === 'wide' ? <Box basis='1/3' justify='center' align='center'>
              <StatNumber level={2} size='large' margin={{ top: 'none', bottom: 'medium' }}>
                ${numeral(funds * gasPriceUSD).format('0,0')}
              </StatNumber>
              <Heading level={3} size={responsiveState === 'wide' ? 'large' : 'medium'} margin='none'>
                Reserved
              </Heading>
            </Box> : null}
          </StatsInnerBox>
        </WidthCappedContainer>
      </StatsBox>,
      <Box key='content-2'>
        <WhiteSection
          background='white'
          direction='row'
          align='center'
          pad='large'
        >
          <BlurbsContainer direction='row' wrap='wrap'>
            <Box basis={responsiveState === 'wide' ? '1/3' : 'full'}>
              <Heading level={3} margin={{ top: responsiveState === 'wide' ? 'none' : undefined }}>
                How does it work?
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
                &ldquo;Demand&rdquo; a Shipment
              </Heading>
              <BlurbParagraph>
                Whether it&apos;s a new phone or a package from a friend, Chain Line can help
                transport the goods you need.
              </BlurbParagraph>
              <BlurbPoints>
                <li>Tell it what you need</li>
                <li>Deposit the cost of the item</li>
                <li>You are matched to a courier</li>
                <li>You receive your item!</li>
              </BlurbPoints>
              <Box margin={{ top: 'small' }}>
                <RoutedAnchor primary={true} path='/demand/create' label='Demand a shipment' />
              </Box>
            </Box>

            <Box basis={responsiveState === 'wide' ? '1/3' : 'full'}>
              <Heading level={3} margin={{ top: responsiveState === 'wide' ? 'none' : undefined }}>
                Become a Courier
              </Heading>
              <BlurbParagraph>
                Couriers transport items to fulfill demands and earn courier fees.
              </BlurbParagraph>
              <BlurbParagraph>
                Register your travel dates with Chain Line and it will try to match you up with
                someone looking to ship an item from the city you are in.
                You buy the item and deliver it in your own time.
              </BlurbParagraph>
              <Box margin={{ top: 'small' }}>
                <RoutedAnchor primary={true} path='/travel/create' label='Register your travel' />
              </Box>
            </Box>
          </BlurbsContainer>
        </WhiteSection>
      </Box>,
    ]);
  }
}

export default withBlockchainProvider(withRouter(Home));
