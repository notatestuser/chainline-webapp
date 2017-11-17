import React, { Component } from 'react';
import { withRouter } from 'react-router';
import AutoForm from 'react-auto-form';
import PropTypes from 'prop-types';
import pick from 'pedantic-pick';
import numeral from 'numeral';

import styled from 'styled-components';
import { Box, Heading, Paragraph, Anchor, Button, TextInput, RadioButton } from 'grommet';
import { CircleInformation } from 'grommet-icons';

import { Constants, openDemand } from 'chainline-js';
import { string2hex, calculateRealGasConsumption, formatGasConsumption } from '../utils';
import { WidthCappedContainer, Field, NotifyLayer, WaitForInvokeLayer, CityTextInput } from '../components';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const MAX_INFO_LEN = 128;
const MIN_ITEM_VALUE_GAS = 0.5;

const NoticeParagraph = styled(Paragraph)` margin-top: 0; `;
const CostReadout = styled(Paragraph)` font-weight: 500; `;
const Disclaimer = styled(Paragraph)` font-weight: 500; `;

export const MSG_GAS_CONSUMED = (gasConsumed, rewardGas) => [
  <NoticeParagraph key='MSG_GAS_CONSUMED-0' size='full' margin={{ bottom: 'small' }}>
    Using a smart contract{' '}
    <Anchor href='http://docs.neo.org/en-us/sc/systemfees.html' target='_blank' rel='noopener noreferrer'>
      incurs system fees
    </Anchor>. There is often a cost associated with{' '}
    &ldquo;invoking&rdquo; a contract to deter spammers and secure the system.
  </NoticeParagraph>,
  <CostReadout key='MSG_GAS_CONSUMED-1' size='full'>
    System fees payable now: {formatGasConsumption(gasConsumed)} GAS
    {rewardGas ? <br /> : null}
    {rewardGas ?
      <span>Reward upon successful delivery: {formatGasConsumption(rewardGas)} GAS</span> : null}
  </CostReadout>,
  <NoticeParagraph key='MSG_GAS_CONSUMED-2' size='full'>
    If you agree to pay these fees{' '}
    click &ldquo;Okay&rdquo; and then &ldquo;Confirm Payment&rdquo;.
  </NoticeParagraph>,
  <NoticeParagraph key='MSG_GAS_CONSUMED-3' size='full' margin='none'>
    Please take some time to make sure everything you have entered is correct.{' '}
    It cannot be changed once sent to the smart contract.
  </NoticeParagraph>,
];

class DemandPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    sendingTx: false,
    showingGasConsumptionNotice: false,
    pickUpCity: null,
    dropOffCity: null,
    selectedItemSize: 'S',
    infoCharsUsed: 0,
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
    } else if (name === 'pickUpCity') {
      this.setState({ pickUpCity: value, gasConsumed });
    } else if (name === 'dropOffCity') {
      this.setState({ dropOffCity: value, gasConsumed });
    } else {
      this.setState({ gasConsumed });
    }
  }

  _onSubmit = async (ev, data) => {
    const { wallet: { wif: accountWif, net, effectiveBalance: balance } } = this.props;
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

      console.debug('Effective balance:', balance);
      if (requiredGAS > balance) {
        throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required (with fee)`);
      }

      const invokeArgs = {
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
      };

      // case: user has not seen the system fees popup yet, run a test invoke
      if (!this.state.gasConsumed) {
        const { result, gasConsumed, success } = await openDemand(net, accountWif, invokeArgs);
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
        console.debug('Effective balance:', balance);
        if (requiredGAS + this.state.gasConsumed > balance) {
          throw new Error(`Insufficient funds. ${requiredGAS.toFixed(3)} GAS required`);
        }

        // do the real invoke
        const { result } =
            await openDemand(net, accountWif, invokeArgs, true, this.state.gasConsumed);
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
    const { wallet: { wif: accountWif, stateLookupKey }, gasPriceUSD } = this.props;

    // not logged in
    if (!accountWif) {
      return (<Box key='content' direction='column'>
        <Box background='white' direction='column' pad='large'>
          <WidthCappedContainer>
            <Heading level={2} margin={{ top: 'none', bottom: 'xlarge' }}>
              You must log in to do this!
            </Heading>
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
              Please complete your existing transaction first.
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
      infoCharsUsed,
      itemValueGAS,
      requiredGAS,
      gasConsumed,
    } = this.state;

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
      /* "Waiting for invoke" popup */
      sendingTx ? <WaitForInvokeLayer
        key='demand-invokelayer'
        onInvokeComplete={({ wallet: { stateLookupKey: key } }) => {
          const { history } = this.props;
          history.push(`/track/${key}/${pickUpCity}/${dropOffCity}`);
        }}
      /> : null,

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
                  Demand a Shipment
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
                <Field label='Collect from city' help='Not publicly visible*'>
                  <CityTextInput name='pickUpCity' />
                </Field>
                <Field label='Deliver to city' help='Not publicly visible*'>
                  <CityTextInput name='dropOffCity' />
                </Field>
                <Field label={`Expire at midnight before (${timezoneAbbr})`}>
                  <TextInput name='expiry' type='date' placeholder='date' defaultValue={defaultExpiryDate} plain={true} />
                </Field>
                <Field label='User reputation requirement'>
                  <TextInput name='reputation' type='number' placeholder='0-1000 successful prior transactions. For now 0 is recommended.' plain={true} />
                </Field>
                <Box margin={{ top: 'medlarge2' }}>
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
              All entered information, unless marked with an asterisk *,{' '}
              is publicly visible on the blockchain
            </Disclaimer>
          </WidthCappedContainer>
        </Box>
      </Box>,
    ]);
  }
}

export default withBlockchainProvider(withRouter(DemandPage));
