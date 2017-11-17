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
          <Text margin={{ bottom: 'medium' }}>
            Meet with the {otherPartyName} in a <Boldish>public place</Boldish>.{' '}
            Use the contact details shown to the left of this text to contact them.
          </Text>
          {otherPartyName === 'demand owner' ? [<Text key='k0' margin={{ bottom: 'medium' }}>
              Deliver the item and ask the {otherPartyName} to go to their{' '}
              tracking page to complete the transaction.
          </Text>, <Text key='k1'>
            You will then receive{' '}
            a refund from the {otherPartyName} when they complete the instructions{' '}
            on that page.
          </Text>] : null}
          {otherPartyName === 'courier' ? [<Text key='k0' margin={{ bottom: 'medium' }}>
            Be sure to check, check and double check your item before accepting{' '}
            the delivery.
          </Text>, <Text key='k1' margin={{ bottom: 'medium' }}>
            When you are ready to refund the {otherPartyName}, please click the &ldquo;Send Refund&rdquo;{' '}
            button below the matched travel to the left of this text.{' '}
            You must be logged in to do this.
          </Text>] : null}
        </Box>);
    }

    if (progress === 3) {
      return (
        <Box direction='row'>
          <Checkmark size='large' />
          <Text margin={{ left: 'small' }}>
            This transaction has been completed. No further action is required.
          </Text>
        </Box>);
    }

    return null;
  }
}

export default withBlockchainProvider(TrackingNextSteps);
