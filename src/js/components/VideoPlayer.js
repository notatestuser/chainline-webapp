import React, { Component } from 'react';

import styled from 'styled-components';
import { Box, Text, Button, Stack, Video } from 'grommet';
import { PlayFill as Play, Revert } from 'grommet-icons';

const VIDEO_CONTENT = src => [
  <source key='video' src={src} type='video/mp4' />,
  <track
    key='cc'
    label='English'
    kind='subtitles'
    srcLang='en'
    src='/assets/small-en.vtt'
    default={true}
  />,
];

const CenteredBox = styled(Box)`
  background: rgb(240, 240, 240);
  width: ${props => props.width};
  height: ${props =>
    props.responsiveState !== 'wide' ? 'auto' : `${(9 / 16) * Number.parseInt(props.width, 10)}px`};
  margin-left: auto;
  margin-right: auto;
`;

const FullHeightStack = styled(Stack)`
  align-items: center;
  display: flex;
  height: 100%;
`;

const PlayIntroText = styled(Text)`
  font-size: 25px;
  font-weight: 500;
  position: relative;
  top: 30px;
  user-select: none;
`;

class VideoPlayer extends Component {
  state = {
    state: 'before',
  }

  render() {
    const { state } = this.state;
    const { src, margin, width, responsiveState } = this.props;

    return (<CenteredBox align='center' margin={margin} width={width} responsiveState={responsiveState}>
      <FullHeightStack>
        <Video
          controls={false}
          autoPlay={state === 'during'}
          onEnded={() => this.setState({ state: 'after' })}
        >
          {VIDEO_CONTENT(src)}
        </Video>

        {state === 'before' ? <Box justify='center' align='center' background={{ dark: true }}>
          <Button onClick={() => this.setState({ state: 'during' })}>
            <Box
              pad='medium'
              round='medium'
              background={{ color: 'neutral-1', opacity: 'strong' }}
            >
              <Play size={responsiveState === 'wide' ? 'xlarge' : 'large'} color='accent-4' />
            </Box>
          </Button>
          <PlayIntroText color='accent-4'>
            PLAY INTRO
          </PlayIntroText>
        </Box> : null}

        {state === 'after' ? <Box direction='row' justify='center' align='center'>
          <Button onClick={() => this.setState({ state: 'during' })}>
            <Box
              margin='small'
              pad='medium'
              round='medium'
              background={{ color: 'light-4', opacity: 'weak' }}
            >
              <Revert size='large' />
            </Box>
          </Button>
        </Box> : null}
      </FullHeightStack>
    </CenteredBox>);
  }
}

export default VideoPlayer;
