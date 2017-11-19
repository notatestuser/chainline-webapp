import React, { Component } from 'react';

import {
  Constants,
  doSendAsset,
  getDemandTravelMatch,
  getObjectByKey,
  getScriptHashFromAddress,
  getTravelDemandMatch,
  hexstring2ab,
  isDemandHex,
  isTravelHex,
  parseDemandHex,
  parseTravelHex,
  reverseHex,
  setFundsPaidToRecipientTxHash,
  toAddress,
} from 'chainline-js';

import { Box, Heading, Text, Paragraph, Button } from 'grommet';

import { DemandView, TravelView, SendLayer, WaitForInvokeLayer } from './';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

// meh, no local invoke this time.
const COMPLETION_INVOKE_GAS_COST = 2;

class DemandOrTravelWithMatch extends Component {
  state = {
    sendingTx: false,
    match: null,
    matchParsed: null,
    parsedObject: null,
    isRefundBuyerOpen: false,
  }

  async componentWillMount() {
    const { object, wallet, noRecurse, onMatchDiscovery } = this.props;
    if (noRecurse || this.state.match || !wallet) return;
    let match;
    let matchType;
    let matchParsed;
    let parsedObject;
    if (isDemandHex(object)) {
      match = await getDemandTravelMatch(wallet.net, object);
      matchType = 'Travel';
      matchParsed = parseTravelHex(match.travel);
      parsedObject = parseDemandHex(object);
    } else if (isTravelHex(object)) {
      match = await getTravelDemandMatch(wallet.net, object);
      matchType = 'Demand';
    }
    if (match) {
      this.setState({ match, matchType, matchParsed, parsedObject });
      if (onMatchDiscovery) onMatchDiscovery(match);
    }
  }

  _onRefundBuyerClicked = () => {
    this.setState({ isRefundBuyerOpen: true });
  }

  _onSendFunds = async (address, amount) => {
    const { wallet: { wif: accountWif, programHash: senderHash, net } } = this.props;
    const { result, hash: txHash } = await doSendAsset(net, address, accountWif, { GAS: amount });
    if (result) {
      this.setState({ sendingTx: true, isRefundBuyerOpen: false });
      console.info('Waiting 60 seconds for the transaction to clear');
      await new Promise(resolve => setTimeout(resolve, 60000)); // wait 60 secs
      // get the demand owner's reservation so that we make sure we're sending its exact value
      const reservation = await getObjectByKey(net, `${senderHash}00`);
      const reservationValue = reservation.substr(8, 10); // 5 bytes in hex after the timestamp
      const recipientHash = getScriptHashFromAddress(address);
      const args = {
        recipientHash: reverseHex(recipientHash),
        value: reservationValue,
        txHash: reverseHex(txHash),
      };
      console.info('Invoking setFundsPaidToRecipientTxHash now with args:', args);
      const { result: invokeResult } =
        await setFundsPaidToRecipientTxHash(net, accountWif, args, COMPLETION_INVOKE_GAS_COST);
      if (!invokeResult) {
        alert('Node RPC returned false. Please try again later.');
        this.setState({ sendingTx: false });
      }
      console.log('setFundsPaidToRecipientTxHash result', invokeResult);
    } else {
      console.warn('Non-success result upon trying to send the tx!');
    }
  }

  render() {
    const { match, matchType, isRefundBuyerOpen, sendingTx } = this.state;
    const { object, extraAttributes: incomingAttributes, progress } = this.props;
    const extraAttributes = {
      ...(incomingAttributes || {}),
    };
    const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];

    let balance;
    let wif;
    if (isRefundBuyerOpen) {
      balance = this.props.wallet.balance;
      wif = this.props.wallet.wif;
    }

    let preFilledAddress;
    let preFilledAmount;
    if (isRefundBuyerOpen) {
      preFilledAddress = toAddress(hexstring2ab(this.state.matchParsed.owner));
      preFilledAmount =
        parseFloat(
          (this.state.parsedObject.itemValue + Constants.FEE_DEMAND_REWARD_GAS + 0.001)
            .toFixed(8));
    }

    const shouldShowRefundButton =
        matchType === 'Travel' && this.props.wallet.wif && (!progress || progress < 3);

    return [
      isDemandHex(object) ? <DemandView key='d' demand={object} extraAttributes={extraAttributes} /> : null,
      isTravelHex(object) ? <TravelView key='t' travel={object} extraAttributes={extraAttributes} /> : null,
      match ? <Box key='m'>
        <Heading level={3} margin={{ top: 'large' }}>
          Matched with {matchType}
        </Heading>
        <Text margin={{ bottom: 'medium' }}>
          Matched at {match.matchDate.toLocaleString()} {timezoneAbbr}
        </Text>
        <DemandOrTravelWithMatch noRecurse={true} object={match[matchType.toLowerCase()]} />
        {shouldShowRefundButton ?
          <Box margin={{ top: 'large' }}>
            <Button primary={true} label='Send the Refund' onClick={this._onRefundBuyerClicked} />
          </Box> :
          null}
      </Box> : null,
      isRefundBuyerOpen ? <SendLayer
        preFilledAddress={preFilledAddress}
        preFilledAmount={preFilledAmount}
        balance={
          balance + this.state.parsedObject.itemValue + Constants.FEE_DEMAND_REWARD_GAS}
        accountWif={wif}
        onClose={() => { this.setState({ isRefundBuyerOpen: false }); }}
        onSendFunds={this._onSendFunds}
        extraInfo={
          <Paragraph>
            <strong>IMPORTANT</strong>{' '}
            Please ensure you have +{COMPLETION_INVOKE_GAS_COST} extra GAS to cover system fees.{' '}
            This is will be improved in the future!
          </Paragraph>
        }
      /> : null,
      sendingTx ? <WaitForInvokeLayer
        key='demand-invokelayer'
        onInvokeComplete={() => {
          alert('All done! Thank you for using Chain Line!');
          this.setState({ sendingTx: false });
          window.location.reload();
        }}
      /> : null,
    ];
  }
}

export default withBlockchainProvider(DemandOrTravelWithMatch);
