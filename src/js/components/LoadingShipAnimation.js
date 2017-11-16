import React from 'react';

import styled, { keyframes } from 'styled-components';

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

export default () => (
  <ShipAnim>
    <Ship />
    <Waves />
  </ShipAnim>);
