import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import styled from 'styled-components';
import { Box, Heading, Text, Paragraph } from 'grommet';

import { getObjectByKey, makeCityPairHash, isDemandHex, isTravelHex } from 'chainline-js';

import { WidthCappedContainer, DemandOrTravelWithMatch, LoadingShipAnimation } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

require('rc-steps/assets/index.css');

const Bolder = styled.span` font-weight: 500; `;

class TrackingPage extends Component {
  state = {
    loading: true,
    found: false,
    demand: false,
    travel: false,
    trackingId: null,
    city1: null,
    city2: null,
    progress: 0,
  }

  componentDidMount() {
    this._refresh();
  }

  componentWillReceiveProps(nextProps) {
    this._refresh(nextProps);
  }

  async _refresh(props = this.props) {
    const { wallet: { net }, match: { params } } = props;
    const cityPairHash = makeCityPairHash(params.city1, params.city2);
    const combinedId = `${params.trackingId}${cityPairHash}`;
    if (this.state.trackingId === params.trackingId &&
        this.state.city1 === params.city1 &&
        this.state.city2 === params.city2) {
      return;
    }
    this.setState({ loading: true, demand: null, travel: null, found: false, ...params });
    try {
      const object = await getObjectByKey(net, combinedId);
      if (isDemandHex(object, true)) {
        this.setState({ found: true, demand: object, progress: 1 });
      }
      if (isTravelHex(object, true)) {
        this.setState({ found: true, travel: object, progress: 1 });
      }
    } catch (e) {
      this.setState({ found: false });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, found, demand, travel, progress } = this.state;
    const { match: { params: { trackingId, city1, city2 } }, responsiveState } = this.props;

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
              Please double check the tracking ID and cities you entered.
            </Text>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    const objectName = demand ? 'Demand' : 'Travel';
    const extraAttributes = {
      'Route': <span>{city1}&nbsp; ✈ &nbsp;{city2}</span>,
    };
    return (
      <Box key='travel-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <Box>
              <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
                {objectName} tracker
              </Heading>
            </Box>
            <Box pad={{ bottom: responsiveState === 'wide' ? 'large' : 'small' }}>
              <Paragraph size='full'>
                <Bolder>Your tracking ID is shown here:</Bolder> {trackingId}<br />
                <Bolder>Keep a note of this &mdash; you will need it later!</Bolder>
              </Paragraph>
            </Box>
            {responsiveState === 'wide' && progress > 0 ? <Box margin={{ bottom: 'medium' }}>
              <Steps current={progress - 1}>
                <Step
                  title='Creation'
                  description={`This ${objectName} was created in the Chain Line smart contract.`}
                />
                <Step
                  title='Match'
                  description={`This ${objectName} was matched up with a suitable courier or demand owner.`}
                />
                <Step
                  title='Exchange'
                  description='The goods were exchanged and the transaction is now over.'
                />
                {/* <CustomStep title='Something' description='What what what!' /> */}
              </Steps>
            </Box> : null}
            <Heading level={3}>
              {demand ? 'Demand' : 'Travel'} details
            </Heading>
            <Box>
              <DemandOrTravelWithMatch
                object={demand || travel}
                extraAttributes={extraAttributes}
                onMatchDiscovery={() => { this.setState({ progress: progress + 1 }); }}
              />
            </Box>
          </WidthCappedContainer>
        </Box>
      </Box>);
  }
}

export default withBlockchainProvider(TrackingPage);
