import styled from 'styled-components';
import { Box, Heading, Paragraph, Text, Anchor, RoutedAnchor } from 'grommet';
import { WidthCappedContainer } from './components';

const WAVES_SRC = '/img/home-waves.svg';

/* From App */

export const KeyReadout = styled(Paragraph)`
  font-size: 115%;
  font-weight: 500;
  line-height: 0px;
  margin-bottom: 15px;
`;

export const ReceiveParagraph = styled(Paragraph)` margin-top: 0; `;

export const WarningMsg = styled(Paragraph)` color: red; `;

/* From Layout */

export const HeaderWidgets = styled(WidthCappedContainer)`
  position: relative;
  left: 13px;
`;

export const LogoBox = styled(Box)` border-bottom: 1px solid #e0e0e0; `;

export const LogoImage = styled.img`
  line-height: 0;
  min-width: 250px;
  max-width: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '255px' : '60%'};
  margin: auto;
  width: 100%;
`;

export const LogoRoutedAnchor = styled(RoutedAnchor)`
  align-items: center;
  color: #333;
  display: flex;
  flex: 0 0 auto;
  font-size: 19px;
  font-weight: 500;
  height: 74px; /* there's a 1px border! */
  line-height: 0;
  text-transform: uppercase;
  width: fit-content;
`;

export const HeroBox = styled(Box)`
  background-image: url(${WAVES_SRC});
  background-position: ${props => `bottom 20px left ${props.scrollTop > 0 ? props.scrollTop / 16 : 0}px`};
  background-repeat: repeat-x;
  background-size: 125px;
  padding-bottom: 90px;
`;

export const NavBox = styled(Box)`
  flex-basis: 25%;
  min-width: 250px;
`;

export const NavAnchor = LogoRoutedAnchor.withComponent(Anchor);
export const NavRoutedAnchor = LogoRoutedAnchor.withComponent(RoutedAnchor);

export const SloganImage = styled(LogoImage)`
  margin: 0;
  max-width: 700px;
  transform: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '' : 'scale(1.1)'};
`;

export const HeroHeading = styled(Heading)`
  font-family: Nunito;
  font-weight: 700;
  margin-top: ${({ responsiveState }) =>
    responsiveState === 'wide' ? '55px' : '30px'};
`;

export const SubSloganHeading = styled(Heading)`
  letter-spacing: 0.2px;
  margin-bottom: 28px;
`;

export const Footer = styled(Box)` white-space: nowrap; `;

export const GoBackRoutedAnchor = styled(RoutedAnchor)` margin-left: -5px; `;

export const Boldish = styled.span` font-weight: 500; `;

/* From HomePage */

export const WhiteSection = styled(Box)`
  padding-bottom: 65px;
  padding-top: 65px;
`;

export const StatsHeading = styled.h3`
  font-size: 24px;
  font-weight: 500;
  margin: 50px 0;
  text-align: center;
  text-transform: uppercase;
`;

export const StatsInnerBox = styled(Box)` justify-content: space-around; `;

export const BlurbParagraph = styled(Paragraph)`
  margin-top: 0;
  padding-right: 12px;
`;

export const BlurbPoints = styled.ol`
  margin: 0 0 8px;
`;

export const StatsBox = styled(Box)`
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0 70px;
`;

export const StatNumber = styled(Heading)` transform: scale(1.3); `;

export const BlurbsContainer = styled(WidthCappedContainer)`
  transform-origin: left top;
  transform: scale(1.03);
`;

/* From DemandPage & TravelPage */

export const IntroParagraph = styled(Paragraph)`
  margin-top: 0;
  margin-bottom: 30px;
`;
export const NoticeParagraph = styled(Paragraph)` margin-top: 0; `;
export const CostReadout = styled(Paragraph)` font-weight: 500; `;
export const Disclaimer = styled(Paragraph)` font-weight: 500; `;

/* From Field */

export const FieldLabel = styled(Text)`
  font-size: 17px;
  font-kerning: normal;
`;
