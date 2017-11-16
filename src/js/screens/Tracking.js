import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import styled from 'styled-components';
import { Box, Heading, Text, Paragraph, Select, RoutedAnchor, Meter } from 'grommet';

import { getObjectByKey, makeCityPairHash, isDemandHex, isTravelHex, parseDemandHex, parseTravelHex } from 'chainline-js';

import { WidthCappedContainer, DemandView, TravelView, LoadingShipAnimation } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

require('rc-steps/assets/index.css');

const CustomStep = props => (
  <Step style={{ fontWeight: 'bold', fontStyle: 'italic' }} {...props} />
);

const Bolder = styled.span` font-weight: 500; `;

class TrackingPage extends Component {
  state = {
    loading: true,
    found: false,
    demand: false,
    travel: false,
  }

  async componentWillMount() {
    const { wallet: { net }, match: { params } } = this.props;
    const cityPairHash = makeCityPairHash(params.city1, params.city2);
    const combinedId = `${params.trackingId}${cityPairHash}`;
    try {
      const object = await getObjectByKey(net, combinedId);
      if (isDemandHex(object, true)) this.setState({ found: true, demand: parseDemandHex(object, true) });
      if (isTravelHex(object, true)) this.setState({ found: true, travel: parseTravelHex(object, true) });
    } catch (e) {
      this.setState({ found: false });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, found, demand, travel } = this.state;
    const { match: { params: { trackingId } } } = this.props;

    if (loading) {
      return (<Box background='white' pad='large'>
        <LoadingShipAnimation />
      </Box>);
    }

    if (!loading && !found) {
      return (<Box key='content' direction='column'>
        <Box background='white' direction='column' pad='large'>
          <WidthCappedContainer>
            <Heading level={2} margin={{ top: 'none' }}>
              Oops, that item was not found!
            </Heading>
            <Text margin={{ bottom: 'xlarge' }}>
              Please double check the tracking ID you entered.
            </Text>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    return (
      <Box key='travel-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <Box>
              <Heading level={2} margin={{ top: 'none', bottom: 'large' }}>
                {demand ? 'Demand' : 'Travel'} status tracker
              </Heading>
            </Box>
            <Box>
              <Steps current={1}>
                <Step title='Creation' description='What what what!' />
                <Step title='Matching' description='What what what! What what what! What what what! What what what!' />
                <CustomStep title='Something' description='What what what!' />
              </Steps>
            </Box>
            <Box pad={{ vertical: 'medium' }}>
              <Paragraph size='full'>
                <Bolder>Your tracking ID is shown here:</Bolder> {trackingId}<br />
                <Bolder>Keep a note of this &mdash; you will need it later!</Bolder>
              </Paragraph>
            </Box>
            <Box>
              {demand ? <DemandView demand={demand} /> : null}
              {travel ? <TravelView travel={travel} /> : null}
            </Box>
          </WidthCappedContainer>
        </Box>
      </Box>);
  }
}

export default withBlockchainProvider(TrackingPage);
