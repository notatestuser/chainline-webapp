import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Box, Heading, Text, Anchor, RoutedAnchor } from 'grommet';
import { FormPrevious } from 'grommet-icons';

import { WidthCappedContainer, VideoPlayer } from './components';

const LOGO_SRC = '/img/chainline-logo.svg';
const SLOGAN_SRC = '/img/chainline-slogan.svg';
const VIDEO_SRC = 'https://f001.backblazeb2.com/file/chainline-assets/explainer.mp4';

const HeaderWidgets = styled(WidthCappedContainer)`
  position: relative;
  left: 13px;
`;

const LogoBox = styled(Box)` border-bottom: 1px solid #e0e0e0; `;

const LogoImage = styled.img`
  line-height: 0;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '255px' : 'auto'};
  margin: auto;
  width: 100%;
`;

const LogoRoutedAnchor = styled(RoutedAnchor)`
  align-items: center;
  color: #333;
  display: flex;
  flex: 0 0 auto;
  font-size: 19.5px;
  font-weight: 500;
  height: 74px; /* there's a 1px border! */
  line-height: 0;
  text-transform: uppercase;
  width: fit-content;
`;

const UserGuideAnchor = LogoRoutedAnchor.withComponent(Anchor);

const SloganImage = styled(LogoImage)`
  margin: 0;
  max-width: 715px;
  transform: ${({ responsiveState }) => responsiveState === 'wide' ? '' : 'scale(1.1)'};
`;

const HeroHeading = styled(Heading)`
  font-family: Nunito;
  font-weight: 700;
  margin-top: 50px;
`;

const SubSloganHeading = styled(Heading)`
  letter-spacing: 0.2px;
  margin-bottom: 28px;
`;

const Footer = styled(Box)` white-space: nowrap; `;

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
          <HeaderWidgets justify='flex-end' direction='row'>
            {headerWidgets}
          </HeaderWidgets>
        </Box>

        <LogoBox
          background='white'
          pad={{ vertical: 'none', horizontal: 'large' }}
        >
          <WidthCappedContainer direction='row' align='center' justify='space-between' wrap='wrap'>
            <LogoRoutedAnchor path='/'>
              <LogoImage src={LOGO_SRC} responsiveState={responsiveState} />
            </LogoRoutedAnchor>
            {responsiveState === 'wide' ? <UserGuideAnchor href='https://git.io/vF1SL' target='_blank'>
              User Guide
            </UserGuideAnchor> : null}
          </WidthCappedContainer>
        </LogoBox>

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
              <SubSloganHeading level={3} textAlign='center' size={responsiveState === 'wide' ? 'medium' : 'small'}>
                {/* Introducing a global shipping network with no staff, trains or planes. */}
                a <Boldish>smarter</Boldish> shipping network for the e-commerce era
              </SubSloganHeading>
            </Box>,
            <Box key='hero-1'>
              <VideoPlayer
                src={VIDEO_SRC}
                width='820px'
                margin='medlarge'
                responsiveState={responsiveState}
              />
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
        <Footer
          direction='row'
          align='center'
          pad='medium'
          justify='between'
        >
          <WidthCappedContainer direction='row' justify='space-between'>
            <Text margin='none'>
              © 2017 The Chain Line Contributors.&nbsp;
              {responsiveState === 'wide' ? ' MIT Licensed.' : null}
            </Text>

            {responsiveState === 'wide' ? <Box direction='row' responsive={true}>
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
                  Powered by Neo Smart Economy
                </Anchor>
              </Box>
            </Box> : null}
          </WidthCappedContainer>
        </Footer>
      </Box>,
    ];
  }
}

export default Layout;
