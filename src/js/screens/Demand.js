import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'react-auto-form';
import pick from 'pedantic-pick';
import numeral from 'numeral';

import { Constants, getAccountFromWIFKey, getBalance, getPrice, openDemand } from 'chainline-js';
import RIPEMD160 from 'ripemd160';

import { Box, Heading, Button, TextInput, RadioButton } from 'grommet';
import { WidthCappedContainer, Field, NotifyLayer } from '../components';

import { string2hex } from '../utils';

const CITIES = ['Shanghai', 'London', 'Geneva'];
const MAX_INFO_LEN = 128;

export default class DemandPage extends Component {
  state = {
    loading: false,
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
    selectedItemSize: 'S',
    infoCharsUsed: 0,
    gasPriceUSD: null,
    itemValueGAS: 0,
    requiredGAS: 0,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this._refreshGasPriceUSD();
  }

  _refreshGasPriceUSD = async () => {
    console.debug('Updating GAS/USD price…');
    const gasPriceUSD = await getPrice('GAS', 'USD');
    this.setState({ gasPriceUSD });
  }

  _onChange = (ev, name, value) => {
    if (name === 'infoText') {
      this.setState({ infoCharsUsed: value.length });
    } else if (name === 'itemValue') {
      const { gasPriceUSD } = this.state;
      const itemValueUSD = parseFloat(value);
      if (Number.isNaN(itemValueUSD) || itemValueUSD === 0 || !gasPriceUSD) {
        this.setState({ itemValueGAS: 0 });
      } else {
        const itemValueGAS = itemValueUSD / gasPriceUSD;
        const requiredGAS = Constants.FEE_DEMAND_REWARD_GAS + itemValueGAS;
        this.setState({ itemValueGAS, requiredGAS });
      }
    }
  }

  _onSubmit = async (ev, data) => {
    const { accountWif } = this.props;
    const { selectedItemSize, requiredGAS } = this.state;
    ev.preventDefault();
    try {
      // pick out and validate form values
      const picked = pick(data,
        '!nes::infoText', '!nes::itemValue', '!nes::pickUpCity', '!nes::dropOffCity', '!nes::expiry', '!nes::reputation');
      const repRequired = Number.parseInt(picked.reputation, 10);
      const itemValue = Number.parseFloat(picked.itemValue);
      if (Number.isNaN(itemValue) || Number.isNaN(repRequired)) {
        throw new Error('The item value and minimum reputation must be valid numbers');
      }

      this.setState({ loading: true });

      // balance check
      const { address } = getAccountFromWIFKey(accountWif);
      const { GAS: { balance } } = await getBalance('TestNet', address);
      const requiredFixed8 = requiredGAS * 100000000;
      if (requiredFixed8 > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (with fee)`);
      }

      // invoke on the blockchain
      openDemand('TestNet', this.props.accountWif, {
        // expiry: BigInteger
        // expiry: Number.parseInt(new Date(picked.expiry).getTime() / 1000, 10),
        expiry: 1,
        // repRequired: BigInteger
        repRequired,
        // itemSize: BigInteger
        itemSize: selectedItemSize === 'S' ? 1 : (selectedItemSize === 'M' ? 2 : 3),  // eslint-disable-line
        // itemValue: BigInteger
        itemValue,
        // infoBlob: ByteArray
        infoBlob: string2hex(picked.infoText, 128),
        // pickUpCityHash: Hash160
        pickUpCityHash: (new RIPEMD160()).update(picked.pickUpCity).digest('hex'),
        // dropOffCityHash: Hash160
        dropOffCityHash: (new RIPEMD160()).update(picked.dropOffCity).digest('hex'),
      });
    } catch (pickErr) {
      const { message } = pickErr;
      let errorMsg = 'Unknown error';
      if (message) {
        errorMsg = `${message.charAt(0).toUpperCase()}${message.substr(1)}`;
      }
      this.setState({ loading: false, notifyMessage: `${errorMsg}. Please correct this and try again.` });
    }
  }

  render() {
    const { accountWif } = this.props;
    const {
      loading,
      pickUpCitySuggestions,
      dropOffCitySuggestions,
      notifyMessage,
      infoCharsUsed,
      itemValueGAS,
    } = this.state;

    if (!accountWif) {
      return (<Box key='content' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <Heading level={2} margin={{ top: 'none' }}>
              You must be logged in to do this!
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
                  Open a new demand
                </Heading>
                <Field label='Product and contact information' help={`${MAX_INFO_LEN - infoCharsUsed} letters left`}>
                  <TextInput name='infoText' placeholder='Enter the product name, collection instructions or pastebin link. You must include your contact details.' maxLength={`${MAX_INFO_LEN}`} plain={true} />
                </Field>
                <Field label='Item value (in US Dollars)' help={itemValueGAS ? `${numeral(itemValueGAS).format('0,0.000')} GAS + fee: ${Constants.FEE_DEMAND_REWARD_GAS} GAS` : ''}>
                  <TextInput name='itemValue' type='number' placeholder='Research the market value of the item to make this as accurate as possible. If in doubt, specify more.' plain={true} />
                </Field>
                <Field label='Item size'>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Small item (jewellery, watches, souvenirs)'
                      checked={this.state.selectedItemSize === 'S'}
                      onChange={() => { this.setState({ selectedItemSize: 'S' }); }}
                    />
                  </Box>
                  <Box margin={{ horizontal: 'small' }} direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Medium item (phones, tablets, small electronics)'
                      checked={this.state.selectedItemSize === 'M'}
                      onChange={() => { this.setState({ selectedItemSize: 'M' }); }}
                    />
                  </Box>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='Large item (gift boxes, fashion items)'
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
                  <Button
                    primary={true}
                    type={loading ? 'disabled' : 'submit'}
                    label={loading ? 'Please wait…' : 'Open Demand'}
                  />
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
