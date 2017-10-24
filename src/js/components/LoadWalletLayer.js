import React, { Component } from 'react';

import { Layer, Box, Heading, Button, Paragraph, TextInput, CheckBox } from 'grommet';
import { Close } from 'grommet-icons';
import { Field } from './';

class LoadWalletLayer extends Component {
  state = {
    usePassphrase: false,
  }

  render() {
    const { onClose, onLogin } = this.props;
    const { usePassphrase } = this.state;

    return (<Layer align='top' onEsc={onClose} size='medium'>
      <Box align='end'>
        <Button icon={<Close />} onClick={onClose} />
      </Box>
      <Box direction='row' justify='center'>
        <Box basis='medium' margin={{ vertical: 'none', horizontal: 'large' }}>
          <form
            name='login-form'
            onSubmit={(ev) => {
              ev.preventDefault();
              const inputs = document.forms['login-form'].getElementsByTagName('input');
              const [wif, passphrase] = inputs;
              onLogin(wif, passphrase);
              onClose();
              return false;
            }}
          >
            <Box>
              <Heading level={2} margin='none'>
                Load a wallet
              </Heading>
              <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
                <Paragraph margin={{ bottom: 'medium' }}>
                  Log in to an account you have created before.<br />
                  You must use a valid Chain Line MVP wallet key.
                </Paragraph>
                <Field label='Account Key (WIF)'>
                  <TextInput plain={true} />
                </Field>
                {usePassphrase && <Field label='Passphrase'>
                  <TextInput plain={true} />
                </Field>}
                <Field>
                  <Box pad='small' margin={{ bottom: 'small' }}>
                    <CheckBox
                      label='Use a passphrase'
                      onChange={() => {
                        this.setState({ usePassphrase: !usePassphrase });
                      }}
                    />
                  </Box>
                </Field>
                <Box margin={{ top: 'large' }}>
                  <Button primary={true} type='submit' label='Submit' />
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Layer>);
  }
}

export default LoadWalletLayer;
