import React, { Component } from 'react';
import AutoForm from 'react-auto-form';
import pick from 'pedantic-pick';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Button, TextInput, RadioButton } from 'grommet';
import { CircleInformation } from 'grommet-icons';

import { Constants, openTravel } from 'chainline-js';
import { calculateRealGasConsumption, formatGasConsumption } from '../utils';
import { WidthCappedContainer, Field, NotifyLayer, WaitForInvokeLayer } from '../components';
import withWallet from '../helpers/withWallet';
import { MSG_GAS_CONSUMED } from './Demand';

const CITIES = ['Shanghai', 'London', 'Geneva'];

const IntroParagraph = styled(Paragraph)`
  margin-top: 0;
  margin-bottom: 30px;
`;
const Disclaimer = styled(Paragraph)` font-weight: 500; `;

class TravelPage extends Component {
  state = {
    loading: false,
    sendingTx: false,
    showingGasConsumptionNotice: false,
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
    selectedItemSize: 'S',
    requiredGAS: Constants.FEE_TRAVEL_DEPOSIT_GAS,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onChange = () => {
    this.setState({ gasConsumed: 0 }); // reset, require local invoke again
  }

  _onSubmit = async (ev, data) => {
    const { wallet: { wif: accountWif, net, effectiveBalance: balance } } = this.props;
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

      // live balance check
      console.log('Effective balance:', balance);
      if (requiredGAS > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (deposit)`);
      }

      const args = {
        // expiry: BigInteger
        expiry: Number.parseInt(new Date(picked.expiry).getTime() / 1000, 10),
        // repRequired: BigInteger
        repRequired,
        // carrySpace: BigInteger
        carrySpace: selectedItemSize === 'S' ? 1 : (selectedItemSize === 'M' ? 2 : 3),  // eslint-disable-line
        // pickUpCity: String (hashed downstream)
        pickUpCity: picked.pickUpCity,
        // dropOffCity: String
        dropOffCity: picked.dropOffCity,
      };

      // case: user has not seen the system fees popup yet, run a test invoke
      if (!this.state.gasConsumed) {
        // invoke contract on the blockchain
        const { result, gasConsumed, success } = await openTravel(net, accountWif, args);
        if (!success || !result) {
          throw new Error('Non-success return value');
        }

        const realGasConsumption = calculateRealGasConsumption(gasConsumed);
        this.setState({
          gasConsumed: realGasConsumption,
          notifyMessage: MSG_GAS_CONSUMED(realGasConsumption),
          showingGasConsumptionNotice: true,
        });

      // case: user has confirmed the fee payment
      } else if (this.state.gasConsumed) {
        // live balance check (again)
        console.log('Effective balance:', balance);
        if (requiredGAS + this.state.gasConsumed > balance) {
          throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (deposit + fees)`);
        }

        const { result } = await openTravel(net, accountWif, args, true, this.state.gasConsumed);
        this.setState({ loading: true });
        if (!result) {
          throw new Error('Non-success return value');
        }
        this.setState({ sendingTx: true });
      } else {
        throw new Error('Unexpected form state');
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
              You must log in to proceed.
            </Heading>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    const {
      loading,
      sendingTx,
      showingGasConsumptionNotice,
      pickUpCitySuggestions,
      dropOffCitySuggestions,
      notifyMessage,
      requiredGAS,
      gasConsumed,
    } = this.state;

    const nowDatePlusOneDay = Date.now() + 86400000; // 1 day in ms
    const earliestTravelDate = new Date(nowDatePlusOneDay).toISOString().substring(0, 16);
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    const totalPaymentGAS = formatGasConsumption(requiredGAS + gasConsumed);
    const submitLabel = gasConsumed && !showingGasConsumptionNotice ?
      `Confirm Payment: ${totalPaymentGAS} GAS` :
      'Register Travel';

    return ([
      /* "Waiting for invoke" popup */
      sendingTx ? <WaitForInvokeLayer
        key='travel-invokelayer'
        onInvokeComplete={() => { alert('Invoke complete!'); }}
      /> : null,

      /* Simple notifications */
      notifyMessage ? <NotifyLayer
        key='travel-notify'
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
      <Box key='travel-form' direction='column'>
        <Box
          background='white'
          direction='column'
          pad='large'
        >
          <WidthCappedContainer>
            <AutoForm onChange={this._onChange} onSubmit={this._onSubmit} trimOnSubmit={true}>
              <Box>
                <Heading level={2} margin={{ top: 'none', bottom: 'medlarge' }}>
                  Register your travel
                </Heading>
                <IntroParagraph size='full'>
                  The system will reserve a refundable deposit of {requiredGAS} GAS.&nbsp;
                  Please make sure that you have this in your wallet.
                </IntroParagraph>
                <Field
                  label='Departure city'
                  help='Not publicly visible*'
                >
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
                <Field
                  label='Destination city'
                  help='Not publicly visible*'
                >
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
                  <TextInput name='expiry' type='datetime-local' min={earliestTravelDate} plain={true} />
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

export default withWallet(TravelPage);
