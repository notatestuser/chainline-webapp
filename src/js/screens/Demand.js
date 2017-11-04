import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'react-auto-form';
import pick from 'pedantic-pick';

import { openDemand } from 'chainline-js';
import RIPEMD160 from 'ripemd160';

import { Box, Heading, Button, TextInput, RadioButton } from 'grommet';
import { WidthCappedContainer, Field, NotifyLayer } from '../components';

import { string2hex } from '../utils';

const CITIES = ['Shanghai', 'London', 'Geneva'];
const MAX_INFO_LEN = 128;

export default class DemandPage extends Component {
  state = {
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
    selectedItemSize: 'S',
    infoCharsUsed: 0,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onChange = (ev, name, value) => {
    if (name !== 'infoText') return;
    this.setState({ infoCharsUsed: value.length });
  }

  _onSubmit = (ev, data) => {
    ev.preventDefault();
    try {
      const picked = pick(data,
        '!nes::infoText', '!nes::itemValue', '!nes::pickUpCity', '!nes::dropOffCity', '!nes::expiry', '!nes::reputation');
      const repRequired = Number.parseInt(picked.reputation, 10);
      const itemValue = Number.parseFloat(picked.itemValue);
      if (Number.isNaN(itemValue) || Number.isNaN(repRequired)) {
        throw new Error('The item value and minimum reputation must be valid numbers');
      }
      const { selectedItemSize } = this.state;
      openDemand('TestNet', this.props.accountWif, {
        // expiry: BigInteger
        // expiry: Number.parseInt(new Date(picked.expiry).getTime() / 1000, 10),
        expiry: 1,
        // repRequired: BigInteger
        repRequired,
        // itemSize: BigInteger
        itemSize: selectedItemSize === 'S' ? 1 : (selectedItemSize === 'M' ? 2 : 3),  // eslint-disable-line
        // itemValue: BigInteger
        itemValue, // todo: convert to gas
        // infoBlob: ByteArray
        infoBlob: string2hex(picked.infoText, 128),
        // pickUpCityHash: Hash160
        pickUpCityHash: (new RIPEMD160()).update(picked.pickUpCity).digest('hex'),
        // dropOffCityHash: Hash160
        dropOffCityHash: (new RIPEMD160()).update(picked.dropOffCity).digest('hex'),
      });
    } catch (pickErr) {
      const { message } = pickErr;
      const errorMsg = `${message.charAt(0).toUpperCase()}${message.substr(1)}`;
      this.setState({ notifyMessage: `${errorMsg}. Please correct this and try again.` });
    }
  }

  render() {
    const { accountWif } = this.props;
    const { pickUpCitySuggestions, dropOffCitySuggestions, notifyMessage, infoCharsUsed } = this.state;

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

    const twoDays = 172800000; // in milliseconds
    const nowDatePlusTwoDays = Date.now() + twoDays;
    const defaultExpiryDate = new Date(nowDatePlusTwoDays).toISOString().split('T')[0];
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

    return ([
      /* Simple notifications */
      notifyMessage ? <NotifyLayer
        key='demand-notify'
        size='medium'
        message={notifyMessage}
        onClose={() => { this.setState({ notifyMessage: null }); }}
      /> : null,

      /* Main form */
      <Box key='demand-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <AutoForm onChange={this._onChange} onSubmit={this._onSubmit} trimOnSubmit={true}>
              <Box>
                <Heading level={2} margin={{ top: 'none', bottom: 'medlarge' }}>
                  Create a new demand
                </Heading>
                <Field label='Product and contact information' help={`${MAX_INFO_LEN - infoCharsUsed} letters left`}>
                  <TextInput name='infoText' placeholder='Enter the product name, collection instructions or pastebin link. You must include your contact details.' maxLength={`${MAX_INFO_LEN}`} plain={true} />
                </Field>
                <Field label='Item value (in US Dollars)'>
                  <TextInput name='itemValue' type='number' placeholder='Research the market value of the item to make this as accurate as possible. If in doubt, specify more.' plain={true} />
                </Field>
                <Field label='Item size'>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Small items (jewellery, watches, souvenirs)'
                      checked={this.state.selectedItemSize === 'S'}
                      onChange={() => { this.setState({ selectedItemSize: 'S' }); }}
                    />
                  </Box>
                  <Box margin={{ horizontal: 'small' }} direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Medium items (phones, tablets, small electronics)'
                      checked={this.state.selectedItemSize === 'M'}
                      onChange={() => { this.setState({ selectedItemSize: 'M' }); }}
                    />
                  </Box>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Large items (gift boxes, fashion items)'
                      checked={this.state.selectedItemSize === 'L'}
                      onChange={() => { this.setState({ selectedItemSize: 'L' }); }}
                    />
                  </Box>
                </Field>
                <Field label='Collect from city'>
                  <TextInput
                    name='pickUpCity'
                    placeholder='Must be a main city. Otherwise your demand may not be matched.'
                    suggestions={pickUpCitySuggestions}
                    onSelect={
                      ({ suggestion }) => this.setState({ pickUpCity: suggestion })
                    }
                    onInput={event => this.setState({
                      pickUpCity: event.target.value,
                      pickUpCitySuggestions: event.target.value.length < 3 ? ['Please enter more text'] : CITIES.filter(
                        city => city.match(new RegExp(`^${event.target.value}`, 'i'))
                      ),
                    })}
                    value={this.state.pickUpCity}
                    plain={true}
                  />
                </Field>
                <Field label='Deliver to city'>
                  <TextInput
                    name='dropOffCity'
                    placeholder='Must be a main city. Be sure to have a central and public meeting place in mind for later.'
                    suggestions={dropOffCitySuggestions}
                    onSelect={
                      ({ suggestion }) => this.setState({ dropOffCity: suggestion })
                    }
                    onInput={event => this.setState({
                      dropOffCity: event.target.value,
                      dropOffCitySuggestions: event.target.value.length < 3 ? ['Please enter more text'] : CITIES.filter(
                        city => city.match(new RegExp(`^${event.target.value}`, 'i'))
                      ),
                    })}
                    value={this.state.dropOffCity}
                    plain={true}
                  />
                </Field>
                <Field label={`Expire at midnight before (${timezoneAbbr})`}>
                  <TextInput name='expiry' type='date' placeholder='date' defaultValue={defaultExpiryDate} plain={true} />
                </Field>
                <Field label='User reputation requirement'>
                  <TextInput name='reputation' type='number' placeholder='0-1000 successful prior transactions. For now 0 is recommended.' plain={true} />
                </Field>
                <Box margin={{ top: 'large' }}>
                  <Button primary={true} type='submit' label='Submit' />
                </Box>
              </Box>
            </AutoForm>
          </WidthCappedContainer>
        </Box>
      </Box>,
    ]);
  }
}

DemandPage.contextTypes = {
  router: PropTypes.any,
};
