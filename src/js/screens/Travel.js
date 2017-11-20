import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AutoForm from 'react-auto-form';
import PropTypes from 'prop-types';
import pick from 'pedantic-pick';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Button, TextInput, RadioButton } from 'grommet';
import { CircleInformation } from 'grommet-icons';

import { Constants, openTravel } from 'chainline-js';
import { calculateRealGasConsumption, formatGasConsumption } from '../utils';
import { WidthCappedContainer, Field, NotifyLayer, WaitForInvokeLayer, CityTextInput } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';
import { MSG_GAS_CONSUMED } from './Demand';

const IntroParagraph = styled(Paragraph)`
  margin-top: 0;
  margin-bottom: 30px;
`;
const Disclaimer = styled(Paragraph)` font-weight: 500; `;

class TravelPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    sendingTx: false,
    showingGasConsumptionNotice: false,
    selectedItemSize: 'S',
    requiredGAS: Constants.FEE_TRAVEL_DEPOSIT_GAS,
    gasConsumed: 0,
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  _onChange = (ev, name, value) => {
    const gasConsumed = 0; // reset, require local invoke again
    if (name === 'pickUpCity') {
      this.setState({ pickUpCity: value, gasConsumed });
    } else if (name === 'dropOffCity') {
      this.setState({ dropOffCity: value, gasConsumed });
    } else {
      this.setState({ gasConsumed }); // reset, require local invoke again
    }
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

      console.debug('Effective balance:', balance);
      if (requiredGAS > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (deposit)`);
      }

      const invokeArgs = {
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
        const { result, gasConsumed, success } = await openTravel(net, accountWif, invokeArgs);
        if (!success || !result) {
          throw new Error('Non-success return value');
        }

        const realGasConsumption = calculateRealGasConsumption(gasConsumed);
        this.setState({
          gasConsumed: realGasConsumption,
          notifyMessage: MSG_GAS_CONSUMED(realGasConsumption, Constants.FEE_DEMAND_REWARD_GAS),
          showingGasConsumptionNotice: true,
        });

      // case: user has confirmed the fee payment
      } else if (this.state.gasConsumed) {
        // balance check (again)
        console.debug('Effective balance:', balance);
        const totalRequiredGAS = requiredGAS + this.state.gasConsumed + 0.001;
        if (totalRequiredGAS > balance) {
          throw new Error(`Insufficient funds. ${totalRequiredGAS.toFixed(3)} GAS required (deposit + fees)`);
        }

        // do the real invoke
        const { result } =
            await openTravel(net, accountWif, invokeArgs, true, this.state.gasConsumed);
        this.setState({ loading: true });
        if (!result) {
          throw new Error('Non-success return value');
        }
        this.setState({ sendingTx: true });
      } else {
        throw new Error('Unexpected form state');
      }
    } catch (err) {
      const { message } = err;
      let errorMsg = 'Unknown error';
      if (message) {
        errorMsg = `${message.charAt(0).toUpperCase()}${message.substr(1)}`;
      }
      this.setState({ loading: false, notifyMessage: `${errorMsg}. Please correct this and try again.` });
      console.error('form error', err);
    }
  }

  render() {
    const { wallet: { wif: accountWif, stateLookupKey } } = this.props;

    // not logged in
    if (!accountWif) {
      return (<Box key='content' direction='column'>
        <Box background='white' direction='column' pad='large'>
          <WidthCappedContainer>
            <Box
              animation={[
                { type: 'zoomIn', duration: 700, delay: 80 },
                { type: 'fadeIn', duration: 700, delay: 80 },
                { type: 'slideRight', duration: 700, delay: 80 },
              ]}
            >
              <Heading level={2} margin={{ top: 'none', bottom: 'medlarge' }}>
                Load or create a wallet to start
              </Heading>
            </Box>
            <Box
              animation={[
                { type: 'zoomIn', duration: 600, delay: 500 },
                { type: 'fadeIn', duration: 600, delay: 500 },
                { type: 'slideRight', duration: 600, delay: 500 },
              ]}
            >
              <IntroParagraph size='full'>
                It takes just a few seconds. Use the dropdown in the header.
              </IntroParagraph>
            </Box>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    // existing demand or travel open
    if (stateLookupKey && !this.state.sendingTx) {
      return (<Box key='content' direction='column'>
        <Box background='white' direction='column' pad='large'>
          <WidthCappedContainer>
            <Heading level={2} margin={{ top: 'none', bottom: 'xlarge' }}>
              Please track and complete your existing transaction.
            </Heading>
          </WidthCappedContainer>
        </Box>
      </Box>);
    }

    const {
      loading,
      sendingTx,
      showingGasConsumptionNotice,
      pickUpCity,
      dropOffCity,
      notifyMessage,
      requiredGAS,
      gasConsumed,
    } = this.state;

    const nowDatePlusOneDay = new Date(Date.now() + 86400000); // 1 day in ms
    const earliestTravelDate = nowDatePlusOneDay.toISOString().substring(0, 16);
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
    const totalPaymentGAS = formatGasConsumption(requiredGAS + gasConsumed + 0.001);
    const submitLabel = gasConsumed && !showingGasConsumptionNotice ?
      `Confirm Payment: ${totalPaymentGAS} GAS` :
      'Register Travel';

    return ([
      /* "Waiting for invoke" popup */
      sendingTx ? <WaitForInvokeLayer
        key='travel-invokelayer'
        onInvokeComplete={({ wallet: { stateLookupKey: key } }) => {
          const { history } = this.props;
          history.push(`/track/${key}/${pickUpCity}/${dropOffCity}`);
        }}
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
                  Register Travel
                </Heading>
                <IntroParagraph size='full'>
                  The system will reserve a refundable deposit of {requiredGAS} GAS.&nbsp;
                  Please make sure that you have this in your wallet.
                </IntroParagraph>
                <Field label='Departure city' help='Not publicly visible*'>
                  <CityTextInput name='pickUpCity' />
                </Field>
                <Field label='Destination city' help='Not publicly visible*'>
                  <CityTextInput name='dropOffCity' />
                </Field>
                <Field label={`Travelling at (${timezoneAbbr})`}>
                  <TextInput
                    name='expiry'
                    type='datetime-local'
                    min={earliestTravelDate}
                    placeholder={nowDatePlusOneDay.toLocaleString()}
                    plain={true}
                  />
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
                  <TextInput
                    name='reputation'
                    type='number'
                    min='0'
                    placeholder='0-1000 successful prior transactions. For now 0 is recommended.'
                    plain={true}
                  />
                </Field>
                <Box margin={{ top: 'medlarge2' }}>
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
              All entered information, unless marked with an asterisk *,{' '}
              is publicly visible on the blockchain
            </Disclaimer>
          </WidthCappedContainer>
        </Box>
      </Box>,
    ]);
  }
}

export default withBlockchainProvider(withRouter(TravelPage));
