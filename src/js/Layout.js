import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Box, Heading, Text, Anchor, RoutedAnchor } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { WidthCappedContainer, VideoPlayer } from './components';

const LOGO_SRC = '/img/chainline-logo.svg';
const SLOGAN_SRC = '/img/chainline-slogan.svg';

const LogoImage = styled.img`
  line-height: 0;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '265px' : 'auto'};
  margin: 16px 0px;
  width: 100%;
`;

const SloganImage = styled(LogoImage)`
  margin: 0;
  max-width: 715px;
`;

const HeroHeading = styled(Heading)`
  font-family: Nunito;
  font-weight: 700;
`;

const SubSloganHeading = styled(Heading)`
  letter-spacing: 0.2px;
  margin-bottom: 38px;
`;

const LogoRoutedAnchor = styled(RoutedAnchor)`
  line-height: 0;
  min-height: 70px;
  width: fit-content;
`;

const GoBackRoutedAnchor = styled(RoutedAnchor)` margin-left: -5px; `;

const Boldish = styled.span` font-weight: 500; `;

class Layout extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    const { responsiveState, headerWidgets, children } = this.props;
    const { router } = this.context;
    const { pathname } = router.route.location;

    return [
      // The use of `image` below is a hack to force the darkBackgroundTextColor
      // See https://git.io/vdjYH
      <Box
        key='header'
        background={{ dark: true, image: '#69B8D6' }}
      >
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
          <WidthCappedContainer direction='row'>
            <LogoRoutedAnchor path='/'>
              <LogoImage src={LOGO_SRC} responsiveState={responsiveState} />
            </LogoRoutedAnchor>
          </WidthCappedContainer>
        </Box>

        {pathname === '/' ? <Box
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          {[
            <Box key='hero-0'>
              <HeroHeading
                level={2}
                textAlign='center'
                margin={{ vertical: 'medlarge', bottom: 'none' }}
                size={responsiveState === 'wide' ? 'large' : 'medium'}
              >
                <SloganImage src={SLOGAN_SRC} responsiveState={responsiveState} />
              </HeroHeading>
            </Box>,
            <Box key='hero-1'>
              <SubSloganHeading level={3} textAlign='center' size={responsiveState === 'wide' ? 'medium' : 'small'}>
                {/* Introducing a global shipping network with no staff, trains or planes. */}
                Introducing the <Boldish>smarter</Boldish> shipping network for an e-commerce era
              </SubSloganHeading>
              <VideoPlayer margin={{ top: 'medium', bottom: 'large' }} />
            </Box>,
          ]}
        </Box> : null}

        {pathname !== '/' ? <Box
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          <WidthCappedContainer>
            <GoBackRoutedAnchor
              primary={true}
              path='/'
              label='Go back to the home page'
              icon={<FormPrevious />}
            />
          </WidthCappedContainer>
        </Box> : null}
      </Box>,

      children,

      <Box
        key='footer'
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
                <Anchor href='//github.com/notatestuser/chainline-webapp/wiki' target='_blank'>
                  User Guide
                </Anchor>
              </Box>
              <Box pad={{ horizontal: 'medium' }}>
                <Anchor href='/_src' target='_blank'>
                  Source Code
                </Anchor>
              </Box>
              <Box pad={{ horizontal: 'medium' }}>
                <Anchor href='//neo.org' target='_blank'>
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
