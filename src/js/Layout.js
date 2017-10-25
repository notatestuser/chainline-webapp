import React from 'react';

import { Box, Heading, Text, Anchor } from 'grommet';
import styled from 'styled-components';

import { WidthCappedContainer, VideoPlayer } from './components';

const LOGO_SRC = '/img/chainline-logo.svg';

const LogoImage = styled.img`
  line-height: 0;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '270px' : 'auto'};
  margin: 16px 0px;
  width: 100%;
`;

const Layout = ({ responsiveState, headerWidgets, children }) => [
  // The use of `image` below is a hack to force the darkBackgroundTextColor
  // See https://git.io/vdjYH
  <Box background={{ dark: true, image: '#69B8D6' }}>
    <Box
      background={{ dark: true }}
      direction='row'
      justify='end'
      align='center'
      pad={{ vertical: 'none', horizontal: 'large' }}
    >
      <WidthCappedContainer justify='flex-end' direction='row'>
        {headerWidgets}
      </WidthCappedContainer>
    </Box>

    <Box
      background='white'
      pad={{ vertical: 'none', horizontal: 'large' }}
    >
      <WidthCappedContainer>
        <LogoImage src={LOGO_SRC} responsiveState={responsiveState} />
      </WidthCappedContainer>
    </Box>

    <Box
      pad={{ vertical: 'medium', horizontal: 'large' }}
    >
      <Heading
        textAlign='center'
        level={responsiveState === 'wide' ? 2 : 3}
      >
        <strong>We move more than cargo.</strong>
      </Heading>

      <VideoPlayer margin={{ bottom: 'medium' }} />
    </Box>
  </Box>,

  children,

  <Box
    background='#444444'
    direction='column'
    justify='between'
  >
    <Box
      direction='row'
      align='center'
      pad='medium'
      justify='between'
    >
      <WidthCappedContainer direction='row' justify='space-between'>
        <Text margin='none'>
          © 2017 The Chain Line Author(s).&nbsp;
          MIT Licensed.
        </Text>

        {responsiveState === 'wide' && <Box direction='row' responsive={true}>
          <Box pad={{ horizontal: 'medium' }}>
            <Anchor href='#'>
              User Guide
            </Anchor>
          </Box>
          <Box pad={{ horizontal: 'medium' }}>
            <Anchor href='#'>
              Documentation
            </Anchor>
          </Box>
          <Box pad={{ horizontal: 'medium' }}>
            <Anchor href='#'>
              About the Neo Blockchain
            </Anchor>
          </Box>
        </Box>}
      </WidthCappedContainer>
    </Box>
  </Box>,
];

export default Layout;
