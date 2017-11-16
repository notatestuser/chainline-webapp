import React, { Component } from 'react';

import { Layer, Box, Heading, Text } from 'grommet';

import withBlockchainProvider from '../helpers/withBlockchainProvider';
import { LoadingShipAnimation } from './';

class WaitForInvokeLayer extends Component {
  state = {
    startBalance: null,
    startReserved: null,
  }

  componentWillMount() {
    const { wallet: { balance: startBalance, reserved: startReserved } } = this.props;
    this.setState({ startBalance, startReserved });
  }

  componentDidUpdate() {
    const { wallet: { balance, reserved } } = this.props;
    const { startBalance, startReserved } = this.state;
    console.debug('WaitForInvokeLayer is waiting…', balance, reserved);
    if (balance !== startBalance || reserved !== startReserved) {
      // something changed. take the user to the next page.
      this.props.onInvokeComplete(this.props);
    }
  }

  render() {
    const { onClose, size = 'medium' } = this.props;
    return (<Layer align='top' onEsc={onClose} size={size}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <LoadingShipAnimation />
        <Heading level={3} margin={{ vertical: 'medium', top: 'none' }}>
          Your request is processing, please be patient.
        </Heading>
        <Box margin={{ horizontal: 'none', bottom: 'large' }}>
          <Text>
            Hang on tight there sailor! This could take a minute or two.
          </Text>
          <Text>
            The blockchain is a distributed entity and can take time to update.
          </Text>
          <Text>
            <br />
            Do not reload this page!
          </Text>
        </Box>
      </Box>
    </Layer>);
  }
}

export default withBlockchainProvider(WaitForInvokeLayer);
