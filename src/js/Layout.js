import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Box, Heading, Text, Anchor, RoutedAnchor } from 'grommet';
import { FormPrevious } from 'grommet-icons';
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

const Boldish = styled.strong`
  font-weight: 600;
`;

const HeroBox = styled(Box)`
  min-height: 575px;
`;

class Layout extends Component {
  static contextTypes = {
    router: PropTypes.func,
  }

  render() {
    const { responsiveState, headerWidgets, children } = this.props;
    const { router } = this.context;
    const { pathname } = router.route.location;

    return [
      // The use of `image` below is a hack to force the darkBackgroundTextColor
      // See https://git.io/vdjYH
      <Box background={{ dark: true, image: '#69B8D6' }}>
        <Box
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

        {pathname === '/' ? <HeroBox
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          {[
            <Box
              animation={[
                { type: 'zoomIn', duration: 15000, delay: 100 },
                { type: 'fadeIn', duration: 500, delay: 400 },
              ]}
            >
              <Heading
                textAlign='center'
                level={2}
                size={responsiveState === 'wide' ? 'large' : 'medium'}
              >
                <Boldish>
                  Peer-to-peer shipping,<br />
                  powered by the blockchain.
                </Boldish>
              </Heading>
            </Box>,
            <Box
              animation={[
                { type: 'zoomIn', duration: 1000, delay: 2300 },
                { type: 'fadeIn', duration: 1000, delay: 2200 },
              ]}
            >
              <VideoPlayer margin={{ top: 'small', bottom: 'medium' }} />
            </Box>,
          ]}
        </HeroBox> : null}

        {pathname !== '/' ? <Box
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          <WidthCappedContainer>
            <RoutedAnchor
              primary={true}
              path='/'
              label='Go back to the Home Page'
              icon={<FormPrevious />}
            />
          </WidthCappedContainer>
        </Box> : null}
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
              © 2017 The Chain Line Contributors.&nbsp;
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
  }
}

export default Layout;
