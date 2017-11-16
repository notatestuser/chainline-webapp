import React from 'react';

// const expiry = consumeBytes(state, Constants.TIMESTAMP_SIZE)
// const repRequired = consumeBytes(state, Constants.REP_REQUIRED_SIZE)
// const carrySpace = consumeBytes(state, Constants.CARRY_SPACE_SIZE)
// const owner = consumeBytes(state, Constants.HASH160_SIZE)

export default ({ travel }) => {
  const view = {
    'Expires at': new Date(travel.expiry).toLocaleString(),
    'Owner': `${travel.owner}`,
    'Min. reputation': travel.repRequired,
    'Carry space': travel.carrySpace,
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
