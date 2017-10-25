import React, { Component } from 'react';

import { Box, Button, Stack, Video } from 'grommet';
import { PlayFill as Play, Revert } from 'grommet-icons';

const VIDEO_CONTENT = [
  <source key='video' src='/assets/small.mp4' type='video/mp4' />,
  <track
    key='cc'
    label='English'
    kind='subtitles'
    srcLang='en'
    src='/assets/small-en.vtt'
    default={true}
  />,
];

class VideoPlayer extends Component {
  state = {
    state: 'before',
  }

  render() {
    const { state } = this.state;

    return (<Box align='center' margin={this.props.margin}>
      <Stack>
        <Video
          controls={false}
          autoPlay={state === 'during'}
          onEnded={() => this.setState({ state: 'after' })}
        >
          {VIDEO_CONTENT}
        </Video>

        {state === 'before' ? <Box justify='center' align='center'>
          <Button onClick={() => this.setState({ state: 'during' })}>
            <Box
              pad='medium'
              round='medium'
              background={{ color: 'light-4', opacity: 'weak' }}
            >
              <Play size='large' color='brand' />
            </Box>
          </Button>
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
      </Stack>
    </Box>);
  }
}

export default VideoPlayer;
