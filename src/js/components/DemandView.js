import React from 'react';
import numeral from 'numeral';
import { Anchor } from 'grommet';

import { toAddress, hexstring2ab, parseDemandHex } from 'chainline-js';

import { Table } from './';
import { formatCarrySpace } from '../utils';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const DemandView = ({ demand: hex, wallet: { programHash } }) => {
  const demand = parseDemandHex(hex);
  const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
  const instructionsLabel = (<span>
    Instructions<br />
    <Anchor href='//pastebin.chainline.co/verify' target='_blank'>
      (verify pastebin)
    </Anchor>
  </span>);
  const view = {
    'Expires at': `${demand.expiry.toLocaleString()} ${timezoneAbbr}`,
    'Instructions': demand.infoBlob,
    'Item class': formatCarrySpace(demand.itemSize),
    'Item value': `${numeral(demand.itemValue).format('0,0.0000')} GAS`,
    'Owner address': demand.owner === programHash ? 'You!' : `${toAddress(hexstring2ab(demand.owner))}`,
  };
  const keys = Object.keys(view);
  return (
    <Table>
      <tbody>
        {keys.map((key, idx) => (
          <tr key={idx}>
            <th>{key === 'Instructions' ? instructionsLabel : key}</th>
            <td>{view[key]}</td>
          </tr>))}
      </tbody>
    </Table>);
};

export default withBlockchainProvider(DemandView);
