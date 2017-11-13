import React, { Component } from 'react';
import AutoForm from 'react-auto-form';

import styled from 'styled-components';
import { Layer, Box, Heading, Button, Paragraph, Text, TextInput, Anchor } from 'grommet';
import { Close, FormLock } from 'grommet-icons';
import { Field } from './';

const ErrorMsg = styled(Paragraph)` color: red; `;
const Emphasis = styled.span` font-weight: 500; `;

class CreateWalletLayer extends Component {
  state = {
    loading: false,
    errorMsg: null,
  }

  _onSubmit = async (ev, data) => {
    const { onClose, onCreate } = this.props;
    const { passphrase, passphraseConfirm } = data;
    ev.preventDefault();
    if (!passphrase || !passphrase.length) return;
    if (passphraseConfirm !== passphrase) {
      this.setState({ errorMsg: 'The passphrases do not match!' });
      return;
    }
    this.setState({ loading: true, errorMsg: null });
    await onCreate(passphrase);
    onClose();
  }

  render() {
    const { onClose } = this.props;
    const { loading, errorMsg } = this.state;

    return (<Layer align='top' onEsc={onClose} size='medium'>
      <Box align='end'>
        <Button icon={<Close />} onClick={onClose} />
      </Box>
      <Box direction='row' justify='center'>
        <Box basis='medium' margin={{ vertical: 'none', horizontal: 'large' }}>
          <AutoForm onSubmit={this._onSubmit}>
            <Box>
              <Heading level={2} margin='none'>
                Create a Wallet
              </Heading>
              <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
                <Paragraph margin={{ bottom: 'medium' }}>
                  Your passphrase is secret just like a password.<br />
                  We cannot retrieve it if it is lost &ndash; it is not sent to us.<br />
                  <Emphasis>Be sure to keep it safe!</Emphasis>
                </Paragraph>
                {errorMsg ? <ErrorMsg>
                  {errorMsg}
                </ErrorMsg> : null}
                <Field label='Passphrase'>
                  <TextInput name='passphrase' type='password' plain={true} autoFocus={true} />
                </Field>
                <Field label='Passphrase (again)'>
                  <TextInput name='passphraseConfirm' type='password' plain={true} />
                </Field>
                <Box margin={{ top: 'medium' }}>
                  <Button
                    primary={true}
                    type={loading ? 'disabled' : 'submit'}
                    label={loading ? 'Please wait…' : 'Create Wallet'}
                  />
                </Box>
                <Box direction='row' margin={{ top: 'medlarge' }}>
                  <FormLock />
                  <Text>
                    Your private wallet key is never sent to us.<br />
                    All wallet operations happen in your browser. <br />
                    <Anchor href='https://github.com/notatestuser/chainline-webapp' target='_blank'>
                      Chain Line web app source code
                    </Anchor>
                  </Text>
                </Box>
              </Box>
            </Box>
          </AutoForm>
        </Box>
      </Box>
    </Layer>);
  }
}

export default CreateWalletLayer;
