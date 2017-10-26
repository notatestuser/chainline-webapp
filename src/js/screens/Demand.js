import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Box, Heading, Button, TextInput, Select, CheckBox, RadioButton } from 'grommet';
import { WidthCappedContainer, Field } from '../components';

const BorderlessTextarea = styled.textarea`
  border: 0;
  font: inherit;
  padding: 16px 12px;
  min-height: 128px;
  outline: 0;
  &::placeholder {
    color: #aaa;
  }
`;

export default class DemandPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { accountWif } = this.props;

    if (!accountWif) {
      return (<Box direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <Heading level={2} margin={{ top: 'none' }}>
              Please log in to create a demand!
            </Heading>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    return (
      <Box direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <form
              name='create-form'
              onSubmit={(ev) => {
                ev.preventDefault();
                const form = document.forms['create-form'];
                const inputs = form.getElementsByTagName('input');
                const textareas = form.getElementsByTagName('textarea');
                const [titleInput] = inputs;
                const [contentTextArea] = textareas;
                const title = titleInput.value;
                const content = contentTextArea.value || contentTextArea.textContent;
                alert(title);
                alert(content);
                return false;
              }}
            >
              <Box>
                <Heading level={2} margin={{ top: 'none' }}>
                  Create a new demand
                </Heading>
                <Box margin='none'>
                  <Field label='Title'>
                    <TextInput plain={true} placeholder='e.g. My blockchain haiku' />
                  </Field>
                  <Field label='Content'>
                    <BorderlessTextarea placeholder='Enter some text' />
                  </Field>
                  <Field label='Expiry' direction='row'>
                    <Box margin='small' direction='row'>
                      <RadioButton
                        label=''
                        checked={true}
                        onChange={() => {
                          if (this.state.expireSelect) return; // already selected
                          this.setState({
                            expireSelect: !this.state.expireSelect,
                            expireNever: !this.state.expireNever,
                          });
                        }}
                      />
                      <Select
                        size='medium'
                        options={['a', 'b', 'c']}
                        value={false}
                        onChange={({ option }) => {
                          this.setState({
                            selectedExpiry: option,
                            expireSelect: true,
                            expireNever: false,
                          });
                        }}
                      />
                    </Box>
                    <Box margin={{ horizontal: 'small', vertical: 'small', bottom: 'medium' }}>
                      <RadioButton
                        label='Never expire, keep it forever'
                        checked={false}
                        onChange={() => {
                          if (this.state.expireNever) return; // already selected
                          this.setState({
                            expireNever: !this.state.expireNever,
                            expireSelect: !this.state.expireSelect,
                          });
                        }}
                      />
                    </Box>
                  </Field>
                  <Field label='Privacy'>
                    <Box pad='small' margin={{ bottom: 'small' }}>
                      <CheckBox
                        label='Do not list on Pastebin.com'
                        checked={true}
                        onChange={() => {
                          this.setState({ private: !this.state.private });
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
          </WidthCappedContainer>
        </Box>
      </Box>
    );
  }
}

DemandPage.contextTypes = {
  router: PropTypes.any,
};
