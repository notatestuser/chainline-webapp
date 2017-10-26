import React, { Component } from 'react';

import { Layer, Box, Heading, Text, Button } from 'grommet';
import { Validate, Alert } from 'grommet-icons';

const AUTO_CLOSE_TIME = 1500;

class NotifyLayer extends Component {
  componentDidMount() {
    if (!this.props.autoClose) return;
    setTimeout(() => {
      this.props.onClose();
    }, AUTO_CLOSE_TIME);
  }

  render() {
    const { message, isSuccess, autoClose, onClose, size = 'medium' } = this.props;
    if (!message) return null;
    return (<Layer align='top' onEsc={onClose} size={size}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <Heading level={2} margin='medium'>
          {isSuccess ?
            <Validate size='large' /> :
            <Alert size='large' />
          }&nbsp;
        </Heading>
        <Box margin={{ horizontal: 'none', bottom: autoClose ? 'large' : 'none' }}>
          <Text>
            {message}
          </Text>
          {!autoClose ? <Box align='start' margin={{ vertical: 'medium', top: 'large' }}>
            <Button primary={true} label='Okay' onClick={onClose} />
          </Box> : null}
        </Box>
      </Box>
    </Layer>);
  }
}

export default NotifyLayer;
