import React from 'react';

import { Menu } from 'grommet';
import { Notification } from 'grommet-icons';

const NotificationsWidget = () => (
  <Menu
    background='neutral-5'
    full='grow'
    icon={<Notification />}
    dropAlign={{ right: 'right', top: 'top' }}
    items={[{ label: 'No notifications yet' }]}
  />);

export default NotificationsWidget;
