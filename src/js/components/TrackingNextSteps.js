import React, { Component } from 'react';

import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { InProgress, Deliver, Checkmark } from 'grommet-icons';

import withBlockchainProvider from '../helpers/withBlockchainProvider';

const Boldish = styled.span` font-weight: 500; `;

class TrackingNextSteps extends Component {
  render() {
    const { objectName, progress } = this.props;

    const otherPartyName = objectName === 'Demand' ? 'courier' : 'demand owner';

    if (progress < 2) {
      return (
        <Box direction='row'>
          <InProgress size='large' />
          <Text margin={{ left: 'small' }}>
            Chain Line is waiting to match you with a suitable {otherPartyName}.
          </Text>
        </Box>);
    }

    if (progress === 2) {
      return (
        <Box direction='column'>
          <Box direction='row' margin={{ bottom: 'medium' }}>
            <Deliver size='large' />
            <Text margin={{ left: 'small' }}>
              Your {objectName} has been matched with a {otherPartyName}.
            </Text>
          </Box>
          {otherPartyName === 'demand owner' ? <Text key='k0' margin={{ bottom: 'medium' }}>
            Collect or purchase the item requested by the demand owner from your departure city.{' '}
            Take the item and purchase receipt to your destination.
          </Text> : null}
          <Text margin={{ bottom: 'medium' }}>
            Meet with the {otherPartyName} in a <Boldish>safe public place</Boldish>.{' '}
            {otherPartyName === 'demand owner' ?
              <span>Use the contact details shown to the left of this text to contact them.</span> : null}
            {otherPartyName === 'courier' ?
              <span>The courier will use the contact details provided in the demand to contact you.</span> : null}
          </Text>
          {otherPartyName === 'demand owner' ? [<Text key='k0' margin={{ bottom: 'medium' }}>
              Deliver the item and ask the {otherPartyName} to go to their{' '}
              tracking page to complete the transaction.
          </Text>, <Text key='k1' margin={{ bottom: 'medium' }}>
            Watch the {otherPartyName} send the refund from their tracking page when you{' '}
            hand over the item. You will only receive your refund if they do this.
          </Text>] : null}
          {otherPartyName === 'courier' ? [<Text key='k0' margin={{ bottom: 'medium' }}>
            Be sure to double check your item before accepting the delivery.
          </Text>, <Text key='k1' margin={{ bottom: 'medium' }}>
            When you meet the {otherPartyName} come to this page to exchange the item and{' '}
            perform the refund <Boldish>at the same time</Boldish>.
          </Text>, <Text key='k2' margin={{ bottom: 'medium' }}>
            Click the &ldquo;Send Refund&rdquo; button to the left of this text to do so.{' '}
            This will <Boldish>unlock</Boldish> the funds reserved for the courier.{' '}
            They should see you do this.
          </Text>, <Text key='k3' margin={{ bottom: 'medium' }}>
            You must be logged in to do this.
          </Text>] : null}
        </Box>);
    }

    if (progress >= 3) {
      return (
        <Box direction='row'>
          <Checkmark size='large' />
          <Text margin={{ left: 'small' }}>
            This transaction is complete.<br />
            No further action is required.
          </Text>
        </Box>);
    }

    return null;
  }
}

export default withBlockchainProvider(TrackingNextSteps);
