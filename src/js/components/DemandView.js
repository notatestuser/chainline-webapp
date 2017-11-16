import React from 'react';

// const expiry = consumeBytes(state, Constants.TIMESTAMP_SIZE)
// const itemValue = consumeBytes(state, Constants.VALUE_SIZE)
// const owner = consumeBytes(state, Constants.HASH160_SIZE)
// const repRequired = consumeBytes(state, Constants.REP_REQUIRED_SIZE)
// const itemSize = consumeBytes(state, Constants.CARRY_SPACE_SIZE)
// const infoBlob = consumeBytes(state, Constants.INFO_BLOB_SIZE)

export default ({ demand }) => {
  const view = {
    'Expires at': new Date(demand.expiry).toLocaleString(),
    'Item value': `${demand.itemValue} GAS`,
    'Owner': `${demand.owner}`,
    'Min. reputation': demand.repRequired,
    'Item size': demand.itemSize,
    'Information': demand.infoBlob,
  };
  const keys = Object.keys(view);
  return (
    <table>
      {keys.map(key => (
        <tr>
          <th>{key}</th>
          <td>{view[key]}</td>
        </tr>))}
    </table>);
};
