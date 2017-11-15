import React, { Component } from 'react';
import AutoForm from 'react-auto-form';
import pick from 'pedantic-pick';
import numeral from 'numeral';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Anchor, Button, TextInput, RadioButton } from 'grommet';
import { CircleInformation } from 'grommet-icons';

import { Constants, getBalance, openDemand } from 'chainline-js';
import { string2hex, calculateRealGasConsumption, formatGasConsumption } from '../utils';
import { WidthCappedContainer, Field, NotifyLayer } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const CITIES = ['Shanghai', 'London', 'Geneva'];
const MAX_INFO_LEN = 128;
const MIN_ITEM_VALUE_GAS = 0.5;

const NoticeParagraph = styled(Paragraph)` margin-top: 0; `;
const CostReadout = styled(Paragraph)` font-weight: 500; `;
const Disclaimer = styled(Paragraph)` font-weight: 500; `;

export const MSG_GAS_CONSUMED = gasConsumed => [
  <NoticeParagraph key='MSG_GAS_CONSUMED-0' size='full' margin={{ bottom: 'small' }}>
    Using a smart contract{' '}
    <Anchor href='http://docs.neo.org/en-us/sc/systemfees.html' target='_blank' rel='noopener noreferrer'>
      incurs system fees
    </Anchor>. There is often a cost associated with{' '}
    &ldquo;invoking&rdquo; a contract to deter spammers and secure the system.
  </NoticeParagraph>,
  <CostReadout key='MSG_GAS_CONSUMED-1' size='full'>
    System fees payable now: {formatGasConsumption(gasConsumed)} GAS
  </CostReadout>,
  <NoticeParagraph key='MSG_GAS_CONSUMED-2' size='full' margin='none'>
    If you agree to pay these fees{' '}
    click &ldquo;Okay&rdquo; and then &ldquo;Confirm Payment&rdquo;.
  </NoticeParagraph>,
];

class DemandPage extends Component {
  state = {
    loading: false,
    showingGasConsumptionNotice: false,
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
    selectedItemSize: 'S',
    infoCharsUsed: 0,
    gasPriceUSD: 0,
    itemValueGAS: 0,
    requiredGAS: 0, // item value + fee
    gasConsumed: 0, // invocation cost
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onChange = (ev, name, value) => {
    const gasConsumed = 0; // reset, require local invoke again
    if (name === 'infoText') {
      this.setState({ infoCharsUsed: value.length, gasConsumed });
    } else if (name === 'itemValue') {
      const { gasPriceUSD } = this.props;
      const itemValueUSD = parseFloat(value);
      if (Number.isNaN(itemValueUSD) || itemValueUSD === 0 || !gasPriceUSD) {
        this.setState({ itemValueGAS: 0, gasConsumed });
      } else {
        const itemValueGAS = itemValueUSD / gasPriceUSD;
        const requiredGAS = Constants.FEE_DEMAND_REWARD_GAS + itemValueGAS;
        this.setState({ itemValueGAS, requiredGAS, gasConsumed });
      }
    } else {
      this.setState({ gasConsumed });
    }
  }

  _onSubmit = async (ev, data) => {
    const { wallet: { wif: accountWif, address, net } } = this.props;
    const { selectedItemSize, itemValueGAS, requiredGAS } = this.state;
    ev.preventDefault();
    try {
      // pick out and validate form inputs
      const picked = pick(data,
        '!nes::infoText', '!nes::itemValue', '!nes::pickUpCity', '!nes::dropOffCity', '!nes::expiry', '!nes::reputation');
      const repRequired = Number.parseInt(picked.reputation, 10);
      const itemValue = Number.parseFloat(picked.itemValue);
      if (Number.isNaN(itemValue) || Number.isNaN(repRequired)) {
        throw new Error('The item value and minimum reputation must be valid numbers');
      }

      this.setState({ loading: true });

      // live balance check
      const { GAS: { balance } } = await getBalance(net, address);
      if (requiredGAS > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (with fee)`);
      }

      // invoke contract on the blockchain
      const { result, gasConsumed, success } = await openDemand(net, accountWif, {
        // expiry: BigInteger
        expiry: Number.parseInt(new Date(picked.expiry).getTime() / 1000, 10),
        // repRequired: BigInteger
        repRequired,
        // itemSize: BigInteger
        itemSize: selectedItemSize === 'S' ? 1 : (selectedItemSize === 'M' ? 2 : 3),  // eslint-disable-line
        // itemValue: number (converted to a fixed8 BigInteger in the library)
        itemValue: itemValueGAS,
        // infoBlob: ByteArray
        infoBlob: string2hex(picked.infoText, 128),
        // pickUpCity: String (hashed downstream)
        pickUpCity: picked.pickUpCity,
        // dropOffCity: String
        dropOffCity: picked.dropOffCity,
      });

      if (!success) {
        throw new Error('Non-success return value');
      }

      if (result && !this.state.gasConsumed) {
        const realGasConsumption = calculateRealGasConsumption(gasConsumed);
        this.setState({
          gasConsumed: realGasConsumption,
          notifyMessage: MSG_GAS_CONSUMED(realGasConsumption),
          showingGasConsumptionNotice: true,
        });
      } else {
        throw new Error('Contract invocation failed');
      }
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
    const { wallet: { wif: accountWif }, gasPriceUSD } = this.props;
    const {
      loading,
      showingGasConsumptionNotice,
      pickUpCitySuggestions,
      dropOffCitySuggestions,
      notifyMessage,
      infoCharsUsed,
      itemValueGAS,
      requiredGAS,
      gasConsumed,
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
              You must log in to proceed.
            </Heading>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    const nowDatePlusTwoDays = Date.now() + 172800000; // 2 days in ms
    const defaultExpiryDate = new Date(nowDatePlusTwoDays).toISOString().split('T')[0];
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    const totalPaymentGAS = formatGasConsumption(requiredGAS + gasConsumed);
    const submitLabel = gasConsumed && !showingGasConsumptionNotice ?
      `Confirm Payment: ${totalPaymentGAS} GAS` :
      'Open Demand';
    const meetsMinimumValue = itemValueGAS >= Constants.MIN_GAS_ITEM_VALUE;
    const itemValueHelpText = (meetsMinimumValue ?
      (itemValueGAS ? `${numeral(itemValueGAS).format('0,0.000')} GAS + fee: ${Constants.FEE_DEMAND_REWARD_GAS} GAS` : '') :
      `Minimum: $${numeral(Constants.MIN_GAS_ITEM_VALUE * gasPriceUSD).format('0,0.00')}`);

    return ([
      /* Simple notifications */
      notifyMessage ? <NotifyLayer
        key='demand-notify'
        size='medium'
        message={notifyMessage}
        customIcon={showingGasConsumptionNotice ? <CircleInformation size='large' /> : null}
        onClose={() => {
          this.setState({
            loading: false,
            notifyMessage: null,
            showingGasConsumptionNotice: false,
          });
        }}
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
                  Demand a shipment
                </Heading>
                <Field
                  label={[
                    <span key='caci-0'>Collection and contact details &nbsp;</span>,
                    <Anchor key='caci-1' href='//pastebin.chainline.co/create' target='_blank'>
                      (use the pastebin)
                    </Anchor>,
                  ]}
                  help={`${MAX_INFO_LEN - infoCharsUsed} letters left`}
                >
                  <TextInput name='infoText' placeholder='You must include temporary contact details. Do NOT mention any pickup or dropoff locations in this box.' maxLength={`${MAX_INFO_LEN}`} plain={true} />
                </Field>
                <Field label='Item value (in US Dollars)' help={itemValueHelpText}>
                  <TextInput name='itemValue' type='number' min={(gasPriceUSD * MIN_ITEM_VALUE_GAS).toFixed(2)} step='0.01' placeholder='Research the market value of the item to make this as accurate as possible. If in doubt, specify more.' plain={true} />
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
                <Field
                  label='Collect from city'
                  help='Not publicly visible*'
                >
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
                <Field
                  label='Deliver to city'
                  help='Not publicly visible*'
                >
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
                    type={loading || !meetsMinimumValue ? 'disabled' : 'submit'}
                    label={loading ? 'Please wait…' : submitLabel}
                  />
                </Box>
              </Box>
            </AutoForm>
            <Disclaimer size='full' margin={{ top: 'large' }}>
              Please be aware:<br />
              All entered information, unless marked with an asterisk *,  is publicly visible on the blockchain
            </Disclaimer>
          </WidthCappedContainer>
        </Box>
      </Box>,
    ]);
  }
}

export default withBlockchainProvider(DemandPage);
