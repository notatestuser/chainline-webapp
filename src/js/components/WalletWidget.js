import React from 'react';

import { Menu } from 'grommet';
import { Money, Alert } from 'grommet-icons';

const WalletWidget = ({ accountWif, onOpenWalletClick }) => {
  if (accountWif) {
    // logged in
    return (<Menu
      background='neutral-5'
      full='grow'
      label={<strong>Wallet Balance: 0 GAS</strong>}
      icon={<Money />}
      dropAlign={{ right: 'right', top: 'top' }}
      items={[
        { label: 'Reserved: 0 GAS' },
        { label: 'Send Money' },
        { label: 'Receive Money' }]}
    />);
  }
  // not logged in
  return (<Menu
    background='neutral-5'
    full='grow'
    label={<strong>You are not logged in!</strong>}
    icon={<Alert />}
    dropAlign={{ right: 'right', top: 'top' }}
    items={[
      { label: 'Create a new wallet' },
      { label: 'Load a wallet', onClick: () => onOpenWalletClick() }]}
  />);
};

export default WalletWidget;
