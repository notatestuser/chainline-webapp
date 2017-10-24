import React, { Component } from 'react';

import { Layer, Box, Heading, Text } from 'grommet';
import { Validate } from 'grommet-icons';

const AUTO_CLOSE_TIME = 1500;

class LoggedInMsgLayer extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.onClose();
    }, AUTO_CLOSE_TIME);
  }

  render() {
    return (<Layer align='top' onEsc={this.onClose}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <Heading level={2} margin='medium'>
          <Validate size='large' />&nbsp;
        </Heading>
        <Box margin={{ horizontal: 'none', bottom: 'large' }}>
          <Text>
            You are now logged in.
          </Text>
        </Box>
      </Box>
    </Layer>);
  }
}

export default LoggedInMsgLayer;
