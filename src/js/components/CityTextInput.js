import React, { Component } from 'react';
import unfetch from 'isomorphic-unfetch';

import { TextInput } from 'grommet';

const SUGGEST_API = '/api/cities-suggest.json?search=';
const PLACEHOLDER_CITIES = ['London', 'Geneva', 'Tokyo', 'Seattle'];
const MIN_SUGGEST_INPUT = 2;

class CityTextInput extends Component {
  static placeholderIdx = 0;

  state = {
    value: null,
    suggestions: [],
  }

  constructor() {
    super();
    this.placeholderIdx = CityTextInput.placeholderIdx;
    CityTextInput.placeholderIdx += 1;
    if (CityTextInput.placeholderIdx >= PLACEHOLDER_CITIES.length) {
      CityTextInput.placeholderIdx = 0;
    }
  }

  _onInput = async (event) => {
    const input = event.target.value;
    const shouldSuggest = input.length >= MIN_SUGGEST_INPUT;
    const newState = { value: input };
    if (shouldSuggest) {
      const res = await unfetch(`${SUGGEST_API}${input}`);
      if (!res.ok) {
        newState.suggestions = ['API Error!'];
        this.setState(newState);
        return;
      }
      const suggestions = await res.json();
      if (suggestions.toString() === this.state.suggestions.toString()) {
        this.setState(newState);
        return;
      }
      newState.suggestions = suggestions;
    } else {
      newState.suggestions = [];
    }
    this.setState(newState);
  }

  render() {
    return (
      <TextInput
        {...this.props}
        placeholder={`e.g. ${PLACEHOLDER_CITIES[this.placeholderIdx || 0]}`}
        suggestions={this.state.suggestions}
        onSelect={({ suggestion }) =>
          this.setState({ value: suggestion })}
        onInput={this._onInput}
        value={this.state.value}
        plain={true}
      />);
  }
}

export default CityTextInput;
