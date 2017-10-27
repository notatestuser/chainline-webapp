import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Box, Heading, Button, TextInput, RadioButton } from 'grommet';
import { WidthCappedContainer, Field } from '../components';

const cities = ['Shanghai', 'London', 'Geneva'];

export default class DemandPage extends Component {
  state = {
    citySuggestions: [],
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { accountWif } = this.props;
    const { citySuggestions } = this.state;

    if (!accountWif) {
      return (<Box key='content' direction='column'>
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
      <Box key='content' direction='column'>
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
                  <Field label='What do you need?'>
                    <TextInput plain={true} placeholder='Enter details about the product you want, e.g. iPhone X 256 GB (Japan model), or paste a pastebin link' />
                  </Field>
                  <Field label='Your contact information'>
                    <TextInput plain={true} placeholder='Publicly visible. Not required if you have used a pastebin link above' />
                  </Field>
                  <Field label='User reputation requirement'>
                    <TextInput plain={true} placeholder='0-1000 (successful transactions)' type='number' />
                  </Field>
                  <Field label='Item value (in US Dollars)'>
                    <TextInput plain={true} placeholder='Please research the market value of the item to make this as accurate as possible' type='number' />
                  </Field>
                  <Field label='Item size'>
                    <Box margin='small' direction='row'>
                      <RadioButton
                        label='Small items (jewellery, watches, souvenirs)'
                        checked={true}
                      />
                    </Box>
                    <Box margin='small' direction='row'>
                      <RadioButton
                        label='Medium items (phones, tablets, small electronics)'
                        checked={false}
                      />
                    </Box>
                    <Box margin='small' direction='row'>
                      <RadioButton
                        label='Large items (gift boxes, fashion)'
                        checked={false}
                      />
                    </Box>
                  </Field>
                  <Field label='Collect from city'>
                    <TextInput
                      plain={true}
                      placeholder='Must be a main city, or your demand may not be matched'
                      suggestions={citySuggestions}
                      onSelect={
                        ({ suggestion }) => this.setState({ city: suggestion })
                      }
                      onInput={event => this.setState({
                        city: event.target.value,
                        citySuggestions: event.target.value.length < 3 ? ['Please enter more text'] : cities.filter(
                          city => city.match(new RegExp(`^${event.target.value}`, 'i'))
                        ),
                      })}
                      value={this.state.city}
                    />
                  </Field>
                  <Field label='Expiry date'>
                    <TextInput plain={true} placeholder='date' type='date' />
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
