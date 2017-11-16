import React from 'react';
import { toAddress, hexstring2ab, parseDemandHex } from 'chainline-js';
import { Table } from './';
import { formatCarrySpace } from '../utils';
import withBlockchainProvider from '../helpers/withBlockchainProvider';

const DemandView = ({ demand: hex, wallet: { address } }) => {
  const demand = parseDemandHex(hex);
  const timezoneAbbr = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
  const view = {
    'Expires at': `${demand.expiry.toLocaleString()} ${timezoneAbbr}`,
    'Item class': formatCarrySpace(demand.itemSize),
    'Item value': `${demand.itemValue} GAS`,
    'Min. reputation': demand.repRequired,
    'Information': demand.infoBlob,
    'Owner address': address === demand.owner ? 'You!' : `${toAddress(hexstring2ab(demand.owner))}`,
  };
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

export default withBlockchainProvider(DemandView);
