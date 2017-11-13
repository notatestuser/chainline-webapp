import React, { Component } from 'react';

import styled from 'styled-components';
import { Layer, Box, Heading, Text, Button } from 'grommet';
import { Validate, Alert } from 'grommet-icons';

const AUTO_CLOSE_TIME = 1500;

const Buttons = styled(Box)` margin-top: 30px; `;

class NotifyLayer extends Component {
  componentDidMount() {
    if (!this.props.autoClose) return;
    setTimeout(() => {
      this.props.onClose();
    }, AUTO_CLOSE_TIME);
  }

  render() {
    const { message, isSuccess, customIcon, autoClose, onClose, size = 'medium' } = this.props;
    if (!message) return null;
    return (<Layer align='top' onEsc={onClose} size={size}>
      <Box pad={{ horizontal: 'medium', top: 'medium' }}>
        <Heading level={2} margin='medium'>
          {customIcon || (isSuccess ?
            <Validate size='large' /> :
            <Alert size='large' />
          )}&nbsp;
        </Heading>
        <Box margin={{ horizontal: 'none', bottom: autoClose ? 'large' : 'none' }}>
          <Text>
            {message}
          </Text>
          {!autoClose ? <Buttons align='start' margin={{ vertical: 'medium', bottom: 'medlarge' }}>
            <Button primary={true} label='Okay' onClick={onClose} />
          </Buttons> : null}
        </Box>
      </Box>
    </Layer>);
  }
}

export default NotifyLayer;
