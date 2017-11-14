import React, { Component } from 'react';

import styled, { keyframes } from 'styled-components';
import { Layer, Box, Heading, Text } from 'grommet';

import withWallet from '../helpers/withWallet';

const WavesKeyframes = keyframes`
  0% {
    left: 0;
    top: -5px;
  }
  25% {
    top: 0px;
  }
  60% {
    top: -5px;
  }
  75% {
    top: 0px;
  }
  100% {
    left: -180px;
    top: -5px;
  }
`;

const ShipAnim = styled.div`
  overflow: hidden;
  margin: auto;
  margin-bottom: -20px;
  position: relative;
  &, & * {
    width: 180px;
    height: 180px;
  }
  & > * {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Ship = styled.div`
  background: url(/img/loader-ship.svg) no-repeat;
  top: 3px;
`;

const Waves = styled.div`
  animation: ${WavesKeyframes} 6s linear infinite;
  background: url(/img/loader-waves.svg) repeat-x;
  width: 360px;
`;

class WaitForInvokeLayer extends Component {
  state = {
    startBalance: null,
    startReserved: null,
  }

  componentWillMount() {
    const { wallet: { balance: startBalance, reserved: startReserved } } = this.props;
    this.setState({ startBalance, startReserved });
  }

  componentWillReceiveProps({ wallet: { balance, reserved } }) {
    const { startBalance, startReserved } = this.state;
    console.log('WaitForInvokeLayer componentWillReceiveProps', balance, reserved);
    if (balance !== startBalance || reserved !== startReserved) {
      // something changed. take the user to the next page.
      this.props.onInvokeComplete();
    }
  }


  render() {
    const { onClose, size = 'medium' } = this.props;
    return (<Layer align='top' onEsc={onClose} size={size}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <ShipAnim>
          <Ship />
          <Waves />
        </ShipAnim>
        <Heading level={3} margin='medium'>
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

export default withWallet(WaitForInvokeLayer);
