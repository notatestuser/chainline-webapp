// A Box with working background context inheritance

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import StyledBox from 'grommet/es6/components/Box/StyledBox';
import { colorForName, colorIsDark } from 'grommet/es6/components/utils';

import { withTheme } from 'grommet/es6/components/hocs';

const styledComponents = {
  div: StyledBox,
}; // tag -> styled component

class Box extends Component {
  static contextTypes = {
    grommet: PropTypes.object.isRequired,
  }
  static childContextTypes = {
    grommet: PropTypes.object,
  }

  static defaultProps = {
    direction: 'column',
    tag: 'div',
  };

  getChildContext() {
    const { grommet } = this.context;
    const { background, theme } = this.props;
    let dark;
    if (background) {
      if (typeof background === 'object') {
        dark = background.dark;
      } else {
        const color = colorForName(background, theme);
        if (color) {
          dark = colorIsDark(color);
        }
      }
      // the fix mentioned on L1 is here
      if (typeof dark !== 'boolean') {
        dark = typeof grommet.dark === 'boolean' ? grommet.dark : false;
      }
      return {
        grommet: { ...grommet, dark },
      };
    }
    return {};
  }

  render() {
    const {
      a11yTitle,
      tag,
      ...rest
    } = this.props;

    let StyledComponent = styledComponents[tag];
    if (!StyledComponent) {
      StyledComponent = StyledBox.withComponent(tag);
      styledComponents[tag] = StyledComponent;
    }

    return (
      <StyledComponent
        aria-label={a11yTitle}
        ref={(ref) => { this.componentRef = ref; }}
        {...rest}
      />
    );
  }
}

export default compose(
  withTheme,
)(Box);
