import React from 'react';

import { Heading, Text, Anchor } from 'grommet';
import styled from 'styled-components';

import { Box, WidthCappedContainer } from './components';

const LOGO_SRC = '/img/chainline-logo.svg';

const LogoImage = styled.img`
  line-height: 0;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '250px' : 'auto'};
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
      <WidthCappedContainer size='xlarge' justify='flex-end' direction='row'>
        {headerWidgets}
      </WidthCappedContainer>
    </Box>

    <Box
      background='white'
      pad={{ vertical: 'none', horizontal: 'large' }}
    >
      <WidthCappedContainer size='xlarge'>
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
      <WidthCappedContainer size='xlarge' direction='row' justify='space-between'>
        <Text margin='none'>
          © 2017&nbsp;
          <Anchor href='//github.com/notatestuser'>Luke Plaster</Anchor>.&nbsp;
          Chain Line is MIT Licensed.
        </Text>

        <Box direction='row' responsive={true}>
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
        </Box>
      </WidthCappedContainer>
    </Box>
  </Box>,
];

export default Layout;
