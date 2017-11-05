import styled from 'styled-components';

import chainline from '../themes/chainline';

export const WidthCappedContainer = styled.div`
  align-items: ${props => props.align || 'normal'};
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  justify-content: ${props => props.justify || 'normal'};
  margin: auto;
  max-width: ${props => chainline.global.size[props.size || 'page']};
  width: 100%;
`;

export default WidthCappedContainer;
