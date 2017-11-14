import React, { Component } from 'react';
import AutoForm from 'react-auto-form';

import { Layer, Box, Heading, Button, Paragraph, Text, TextInput, Anchor } from 'grommet';
import { Close, FormLock } from 'grommet-icons';
import { Field } from './';

class LoadWalletLayer extends Component {
  state = {
    loading: false,
  }

  _onSubmit = async (ev, data) => {
    const { onClose, onLogin } = this.props;
    const { wif, passphrase } = data;
    ev.preventDefault();
    if (!wif || !wif.length) return;
    if (!passphrase || !passphrase.length) return;
    this.setState({ loading: true });
    await onLogin(wif, passphrase);
    onClose();
  }

  render() {
    const { onClose } = this.props;
    const { loading } = this.state;

    return (<Layer align='top' onEsc={onClose} size='medium'>
      <Box align='end'>
        <Button icon={<Close />} onClick={loading ? () => {} : onClose} />
      </Box>
      <Box direction='row' justify='center'>
        <Box basis='medium' margin={{ vertical: 'none', horizontal: 'large' }}>
          <AutoForm onSubmit={this._onSubmit}>
            <Box>
              <Heading level={2} margin='none'>
                Load a Wallet
              </Heading>
              <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
                <Paragraph margin={{ bottom: 'medium' }}>
                  Log in to an wallet you have created before.<br />
                  You must use a valid Chain Line MVP wallet key.
                </Paragraph>
                <Field label='Wallet Key (WIF)'>
                  <TextInput name='wif' plain={true} autoFocus={true} />
                </Field>
                <Field label='Passphrase'>
                  <TextInput name='passphrase' type='password' plain={true} />
                </Field>
                <Box margin={{ top: 'medium' }}>
                  <Button
                    primary={true}
                    type={loading ? 'disabled' : 'submit'}
                    label={loading ? 'Please wait…' : 'Load Wallet'}
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

export default LoadWalletLayer;
