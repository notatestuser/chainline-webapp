import React from 'react';

import { Box, Text } from 'grommet';
import styled from 'styled-components';

const Label = styled(Text)`
  font-size: 17px;
  font-kerning: normal;
`;

const Field = ({
  children, error, label, help,
}) => {
  let header;
  if (label || help || error) {
    header = (
      <Box
        direction='row'
        justify='between'
        pad={{ horizontal: 'none', top: 'xsmall' }}
      >
        <Label>{label}</Label>
        <Text color={error ? 'status-critical' : 'dark-5'}>{error || help}</Text>
      </Box>
    );
  }
  return (
    <Box
      direction='column'
      border={{ color: 'light-2', side: 'bottom', size: 'small' }}
      margin={{ vertical: 'xsmall' }}
    >
      {header}
      {children}
    </Box>
  );
};

export default Field;
