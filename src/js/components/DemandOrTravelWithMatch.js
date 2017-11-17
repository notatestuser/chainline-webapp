import React, { Component } from 'react';

import {
  Constants,
  isDemandHex,
  isTravelHex,
  getDemandTravelMatch,
  getTravelDemandMatch,
  parseTravelHex,
  parseDemandHex,
  doSendAsset,
  getScriptHashFromAddress,
  setFundsPaidToRecipientTxHash,
  reverseHex,
  toAddress,
  hexstring2ab,
} from 'chainline-js';

import { Box, Heading, Text, Paragraph, Button } from 'grommet';

import { DemandView, TravelView, SendLayer, WaitForInvokeLayer } from './';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

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
    const { wallet: { wif: accountWif, net } } = this.props;
    const { result, hash: txHash } = await doSendAsset(net, address, accountWif, {
      GAS: parseFloat(amount),
    });
    if (result) {
      this.setState({ sendingTx: true });
      console.info('Waiting 30 seconds for the transaction to clear');
      await new Promise(resolve => setTimeout(resolve, 30000)); // wait 30 secs
      console.info('Invoking setFundsPaidToRecipientTxHash now');
      const recipientHash = getScriptHashFromAddress(address);
      const res = await setFundsPaidToRecipientTxHash(net, accountWif, {
        recipientHash: reverseHex(recipientHash),
        amount: Number.parseInt(amount * 100000000, 10),
        txHash: reverseHex(txHash),
      }, 2);
      console.log('setFundsPaidToRecipientTxHash result', res);
    } else {
      console.warn('Non-success result upon trying to send the tx!');
    }
  }

  render() {
    const { match, matchType, isRefundBuyerOpen, sendingTx } = this.state;
    const { object, extraAttributes: incomingAttributes } = this.props;
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
        {matchType === 'Travel' && this.props.wallet.wif ?
          <Box margin={{ top: 'large' }}>
            <Button primary={true} label='Send the Refund' onClick={this._onRefundBuyerClicked} />
          </Box> :
          null}
      </Box> : null,
      isRefundBuyerOpen ? <SendLayer
        preFilledAddress={
          toAddress(hexstring2ab(this.state.matchParsed.owner))}
        preFilledAmount={
          this.state.parsedObject.itemValue + Constants.FEE_DEMAND_REWARD_GAS + 0.001}
        balance={
          balance + this.state.parsedObject.itemValue + Constants.FEE_DEMAND_REWARD_GAS}
        accountWif={wif}
        onClose={() => { this.setState({ isRefundBuyerOpen: false }); }}
        onSendFunds={this._onSendFunds}
        extraInfo={
          <Paragraph>
            <strong>IMPORTANT</strong>{' '}
            Please ensure you have +2 extra GAS to cover system fees. Sorry about that!
          </Paragraph>
        }
      /> : null,
      sendingTx ? <WaitForInvokeLayer
        key='demand-invokelayer'
        onInvokeComplete={() => {
          alert('All done! Thank you for using Chain Line!');
          this.setState({ sendingTx: false });
        }}
      /> : null,
    ];
  }
}

export default withBlockchainProvider(DemandOrTravelWithMatch);
