import React, { Component } from 'react';
import styled from 'styled-components';

import { isDemandHex, isTravelHex, getDemandTravelMatch, getTravelDemandMatch } from 'chainline-js';

import { Box, Heading, Text } from 'grommet';
import { DemandView, TravelView } from './';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const Bolder = styled.span` font-weight: 500; `;

const STATUSES = [
  'Waiting for a match',
];

class DemandOrTravelWithMatch extends Component {
  state = {
    match: null,
  }

  async componentWillMount() {
    const { object, wallet: { net }, noRecurse, onMatchDiscovery } = this.props;
    if (noRecurse || this.state.match) return;
    let match;
    let matchType;
    if (isDemandHex(object)) {
      match = await getDemandTravelMatch(net, object);
      matchType = 'Travel';
    } else if (isTravelHex(object)) {
      match = await getTravelDemandMatch(net, object);
      matchType = 'Demand';
    }
    if (match) {
      this.setState({ match, matchType });
      if (onMatchDiscovery) onMatchDiscovery(match);
    }
  }

  render() {
    const { match, matchType } = this.state;
    const { object, extraAttributes: incomingAttributes } = this.props;
    const extraAttributes = {
      'Current status': <Bolder>{STATUSES[0]}</Bolder>,
      ...incomingAttributes,
    };
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    return [
      isDemandHex(object) ? <DemandView key='d' demand={object} extraAttributes={extraAttributes} /> : null,
      isTravelHex(object) ? <TravelView key='t' travel={object} extraAttributes={extraAttributes} /> : null,
      match ? <Box key='m'>
        <Heading level={3}>
          Your {matchType} match
        </Heading>
        <Text>
          Matched at {match.matchDate.toLocaleString()} {timezoneAbbr}
        </Text>
        <DemandOrTravelWithMatch noRecurse={true} object={match[matchType.toLowerCase()]} />
      </Box> : null,
    ];
  }
}

export default withBlockchainProvider(DemandOrTravelWithMatch);
