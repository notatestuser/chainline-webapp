import React, { Component } from 'react';
import AutoForm from 'react-auto-form';

import styled from 'styled-components';
import { Layer, Box, Heading, Button, Paragraph, TextInput } from 'grommet';
import { Close } from 'grommet-icons';
import { Field } from './';

const WarningSpan = styled.span` color: red; `;

class SendLayer extends Component {
  state = {
    sending: false,
  }

  _onSubmit = async (ev, data) => {
    const { onClose, onSendFunds } = this.props;
    const { address, amount } = data;
    ev.preventDefault();
    if (!address || !address.length) return;
    if (!amount || !amount.length) return;
    this.setState({ sending: true });
    await onSendFunds(address, amount);
    onClose();
  }

  render() {
    const { balance, onClose, preFilledAddress, preFilledAmount } = this.props;
    const { sending } = this.state;

    return (<Layer align='top' onEsc={onClose} size='medium'>
      <Box align='end' background={{ dark: false }}>
        <Button icon={<Close />} onClick={sending ? () => {} : onClose} />
      </Box>
      <Box direction='row' justify='center'>
        <Box basis='medium' margin={{ vertical: 'none', horizontal: 'large' }}>
          <AutoForm onSubmit={this._onSubmit}>
            <Box>
              <Heading level={2} margin='none'>
                Send Funds
              </Heading>
              <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
                <Paragraph margin={{ bottom: 'medium' }}>
                  Enter the destination address and the amount to send.{' '}
                  <WarningSpan>Funds will arrive on the TestNet.</WarningSpan>
                </Paragraph>
                <Field label='Address'>
                  <TextInput
                    name='address'
                    placeholder='e.g. AZjJrtgADzhYBen5QzXSarqb2LEkpmVjbW'
                    plain={true}
                    autoFocus={true}
                    defaultValue={preFilledAddress}
                    disabled={!!preFilledAddress}
                  />
                </Field>
                <Field label='Amount'>
                  <TextInput
                    name='amount'
                    type='number'
                    max={`${balance}`}
                    min='0'
                    step='0.00000001'
                    placeholder='0.00000000'
                    plain={true}
                    defaultValue={preFilledAmount}
                    disabled={!!preFilledAmount}
                  />
                </Field>
                <Box margin={{ top: 'medium' }}>
                  <Button
                    primary={true}
                    type={sending ? 'disabled' : 'submit'}
                    label={sending ? 'Please wait…' : 'Send Funds'}
                  />
                </Box>
              </Box>
            </Box>
          </AutoForm>
        </Box>
      </Box>
    </Layer>);
  }
}

export default SendLayer;
