import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import { Box, Heading, Text, Paragraph, Responsive } from 'grommet';

import { getObjectByKey, makeCityPairHash, isDemandHex, isTravelHex, parseDemandHex, parseTravelHex } from 'chainline-js';

import { WidthCappedContainer, DemandOrTravelWithMatch, TrackingNextSteps, LoadingShipAnimation } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';
import { Boldish } from '../styles';
import '../../css/rc-steps-overrides.css';

const PROGRESS_STATUSES = {
  1: 'Waiting for a match',
  2: 'Matched, waiting for delivery',
  3: 'Transaction complete',
};

class TrackingPage extends Component {
  state = {
    responsiveState: 'wide',
    loading: true,
    found: false,
    demand: false,
    travel: false,
    trackingId: null,
    city1: null,
    city2: null,
    progress: 0, // 1-3 (1: created, 2: matched, 3: exchanged)
  }

  componentDidMount() {
    this._refresh();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.trackingId === nextProps.match.params.trackingId &&
        this.state.city1 === nextProps.match.params.city1 &&
        this.state.city2 === nextProps.match.params.city2) {
      return;
    }
    this._refresh(nextProps);
  }

  async _refresh(props = this.props) {
    const { wallet: { net }, match: { params } } = props;
    const cityPairHash = makeCityPairHash(params.city1, params.city2);
    const combinedId = `${params.trackingId}${cityPairHash}`;
    this.setState({ loading: true, demand: null, travel: null, found: false, ...params });
    try {
      const object = await getObjectByKey(net, combinedId);
      let newState = {};
      let parsed;
      if (isDemandHex(object)) {
        newState = { found: true, demand: object, progress: 1 };
        parsed = parseDemandHex(object);
      } else if (isTravelHex(object)) {
        newState = { found: true, travel: object, progress: 1 };
        parsed = parseTravelHex(object);
      }
      if (parsed.expiry && parsed.expiry.getTime() < Date.now()) {
        alert('This has expired!');
        throw new Error('Object expired!');
      }
      if (newState.found) {
        // putting this here is a bit of a cheat but it will work...
        // if the user's "state lock" does not match the object then the exchange step is done
        // (transaction complete)
        const owner = parsed.owner;
        try {
          const stateLock = await getObjectByKey(net, owner);
          if (!stateLock.startsWith(newState.demand || newState.travel)) {
            // exchange complete!
            newState.progress = 3;
          }
        } catch (err) {
          // weirdly, this also means the exchange is complete!
          newState.progress = 3;
        }

        this.setState(newState);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      this.setState({ found: false });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, found, demand, travel, progress, responsiveState } = this.state;
    const { match: { params: { trackingId, city1, city2 } } } = this.props;

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
      'Current status': <Boldish>{PROGRESS_STATUSES[progress]}</Boldish>,
      'Route': <span>{city1}&nbsp; ✈ &nbsp;{city2}</span>,
    };

    return (
      <Box key='tracking-form' direction='column'>
        <Responsive
          onChange={(_responsiveState) => {
            this.setState({ responsiveState: _responsiveState });
          }}
        >
          {/* This must be here or it crashes :( */}
          <div />
        </Responsive>
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
            <Box pad={{ bottom: responsiveState === 'wide' ? 'medlarge' : 'small' }}>
              <Paragraph size='full'>
                <Boldish>
                  Your tracking ID is shown here:</Boldish> {trackingId}<br />
                <Boldish>
                  Keep a note of this &mdash; you will need it to return to this page.
                </Boldish>
              </Paragraph>
            </Box>
            {responsiveState === 'wide' && progress > 0 ? <Box margin={{ bottom: 'medlarge' }}>
              <Steps current={Math.min(3, progress) - 1}>
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
            <Box direction={responsiveState === 'wide' ? 'row' : 'column'}>
              <Box basis='2/3'>
                <Heading level={3}>
                  {objectName} details
                </Heading>
                <DemandOrTravelWithMatch
                  object={demand || travel}
                  extraAttributes={extraAttributes}
                  onMatchDiscovery={() => { this.setState({ progress: progress + 1 }); }}
                  progress={progress}
                />
              </Box>
              <Box basis='1/3'>
                <Heading level={3}>
                  What to do next
                </Heading>
                <TrackingNextSteps objectName={objectName} progress={progress} />
              </Box>
            </Box>
          </WidthCappedContainer>
        </Box>
      </Box>);
  }
}

export default withBlockchainProvider(TrackingPage);
