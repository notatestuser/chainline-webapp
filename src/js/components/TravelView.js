import React from 'react';
import { toAddress, hexstring2ab, parseTravelHex } from 'chainline-js';
import { Table } from './';
import { formatCarrySpace } from '../utils';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const TravelView = ({ travel: hex, extraAttributes, wallet: { programHash } }) => {
  const travel = parseTravelHex(hex);
  const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
  const view = Object.assign({}, extraAttributes || {}, {
    'Expires at': `${travel.expiry.toLocaleString()} ${timezoneAbbr}`,
    'Carry space': formatCarrySpace(travel.carrySpace),
    'Min. reputation': travel.repRequired,
    'Owner address': travel.owner === programHash ? 'You!' : `${toAddress(hexstring2ab(travel.owner))}`,
  });
  const keys = Object.keys(view);
  return (
    <Table>
      <tbody>
        {keys.map((key, idx) => (
          <tr key={idx}>
            <th>{key}</th>
            <td>{view[key]}</td>
          </tr>))}
      </tbody>
    </Table>);
};

export default withBlockchainProvider(TravelView);
