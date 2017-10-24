import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { createBrowserHistory } from 'history';

import { Grommet, Responsive, Heading, Text, Menu, Anchor } from 'grommet';
import { Money, Notification } from 'grommet-icons';
import styled from 'styled-components';

import chainline from './themes/chainline';
import { Box, WidthCappedContainer } from './components';
import Home from './screens/Home';

const history = createBrowserHistory();

const THEMES = {
  grommet: undefined,
  chainline,
};

const LOGO_SRC = '/img/chainline-logo.svg';

const LogoImage = styled.img`
  line-height: 0;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '250px' : 'auto'};
  margin: 16px 0px;
  width: 100%;
`;

export default class App extends Component {
  state = {
    responsiveState: 'wide',
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onResponsiveChange = (responsiveState) => {
    this.setState({ responsiveState });
  }

  render() {
    const { responsiveState } = this.state;

    return (
      <Router history={history}>
        <Grommet theme={THEMES.chainline} centered={true}>
          <Responsive onChange={this.onResponsiveChange}>
            <div />
          </Responsive>
          {/* The use of `image` below is a hack to force the darkBackgroundTextColor */}
          {/* See https://git.io/vdjYH */}
          <Box background={{ dark: true, image: '#69B8D6' }}>
            <Box
              background={{ dark: true }}
              direction='row'
              justify='end'
              align='center'
              pad={{ vertical: 'none', horizontal: 'large' }}
            >
              <WidthCappedContainer size='xlarge' justify='flex-end' direction='row'>
                <Menu
                  background='neutral-5'
                  full='grow'
                  label={<strong>Wallet Balance: 0 GAS</strong>}
                  icon={<Money />}
                  dropAlign={{ right: 'right', top: 'top' }}
                  items={[
                    { label: 'Reserved: 0 GAS' },
                    { label: 'Send Money' },
                    { label: 'Receive Money' }]}
                />
                <Menu
                  background='neutral-5'
                  full='grow'
                  icon={<Notification />}
                  dropAlign={{ right: 'right', top: 'top' }}
                  items={[{ label: 'No notifications yet' }]}
                />

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
          </Box>

          <Switch>
            <Route exact={true} path='/' component={Home} />
            <Route exact={true} path='/new-demand' component={() => {}} />
            <Route exact={true} path='/new-travel' component={() => {}} />
            <Route exact={true} path='/track' component={() => {}} />
          </Switch>

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
          </Box>
        </Grommet>
      </Router>
    );
  }
}
