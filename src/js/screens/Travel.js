import React, { Component } from 'react';
import AutoForm from 'react-auto-form';
import pick from 'pedantic-pick';

import RIPEMD160 from 'ripemd160';
import { Constants, getAccountFromWIFKey, getBalance, getPrice, openTravel } from 'chainline-js';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Button, TextInput, RadioButton } from 'grommet';
import { WidthCappedContainer, Field, NotifyLayer } from '../components';
import withWallet from '../helpers/withWallet';

const CITIES = ['Shanghai', 'London', 'Geneva'];

const IntroParagraph = styled(Paragraph)`
  margin-top: 0;
  margin-bottom: 30px;
`;

class TravelPage extends Component {
  state = {
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
    selectedItemSize: 'S',
    gasPriceUSD: 0,
    requiredGAS: Constants.FEE_TRAVEL_DEPOSIT_GAS,
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

  _onSubmit = async (ev, data) => {
    const { wallet: { wif: accountWif } } = this.props;
    const { selectedItemSize, requiredGAS } = this.state;
    ev.preventDefault();
    try {
      // pick out and validate form inputs
      const picked = pick(data,
        '!nes::pickUpCity', '!nes::dropOffCity', '!nes::expiry', '!nes::reputation');
      const repRequired = Number.parseInt(picked.reputation, 10);
      if (Number.isNaN(repRequired)) {
        throw new Error('The minimum reputation must be a valid number');
      }

      this.setState({ loading: true });

      // balance check
      const { address } = getAccountFromWIFKey(accountWif);
      const { GAS: { balance } } = await getBalance('TestNet', address);
      if (requiredGAS > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (deposit)`);
      }

      // invoke contract on the blockchain
      openTravel('TestNet', accountWif, {
        // expiry: BigInteger
        expiry: Number.parseInt(new Date(picked.expiry).getTime() / 1000, 10),
        // repRequired: BigInteger
        repRequired,
        // carrySpace: BigInteger
        carrySpace: selectedItemSize === 'S' ? 1 : (selectedItemSize === 'M' ? 2 : 3),  // eslint-disable-line
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
    const { wallet: { wif: accountWif } } = this.props;
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

    const {
      loading,
      pickUpCitySuggestions,
      dropOffCitySuggestions,
      notifyMessage,
      requiredGAS,
    } = this.state;
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    return ([
      /* Simple notifications */
      notifyMessage ? <NotifyLayer
        key='travel-notify'
        size='medium'
        message={notifyMessage}
        onClose={() => { this.setState({ notifyMessage: null }); }}
      /> : null,

      /* Main form */
      <Box key='travel-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <AutoForm onSubmit={this._onSubmit} trimOnSubmit={true}>
              <Box>
                <Heading level={2} margin={{ top: 'none', bottom: 'medlarge' }}>
                  Register your travel
                </Heading>
                <IntroParagraph size='full'>
                  The system will reserve a refundable deposit of {requiredGAS} GAS.&nbsp;
                  Please make sure that you have this in your wallet.
                </IntroParagraph>
                <Field label='Departure city'>
                  <TextInput
                    name='pickUpCity'
                    placeholder='Must be a main city. Otherwise you may not be matched up.'
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
                <Field label='Destination city'>
                  <TextInput
                    name='dropOffCity'
                    placeholder='Must be a main city. Be sure to contact the demand owner upon arrival to arrange to meet in a public place.'
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
                <Field label={`Travelling at (${timezoneAbbr} time)`}>
                  <TextInput name='expiry' type='datetime-local' plain={true} />
                </Field>
                <Field label='Available carry space'>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='One small item (jewellery, watches, souvenirs)'
                      checked={this.state.selectedItemSize === 'S'}
                      onChange={() => { this.setState({ selectedItemSize: 'S' }); }}
                    />
                  </Box>
                  <Box margin={{ horizontal: 'small' }} direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='One medium item (phones, tablets, small electronics)'
                      checked={this.state.selectedItemSize === 'M'}
                      onChange={() => { this.setState({ selectedItemSize: 'M' }); }}
                    />
                  </Box>
                  <Box margin='small' direction='row'>
                    <RadioButton
                      name='itemSize'
                      label='One large item (gift boxes, fashion items)'
                      checked={this.state.selectedItemSize === 'L'}
                      onChange={() => { this.setState({ selectedItemSize: 'L' }); }}
                    />
                  </Box>
                </Field>
                <Field label='User reputation requirement'>
                  <TextInput name='reputation' type='number' placeholder='0-1000 successful prior transactions. For now 0 is recommended.' plain={true} />
                </Field>
                <Box margin={{ top: 'large' }}>
                  <Button
                    primary={true}
                    type={loading ? 'disabled' : 'submit'}
                    label={loading ? 'Please wait…' : 'Register Travel'}
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

export default withWallet(TravelPage);
