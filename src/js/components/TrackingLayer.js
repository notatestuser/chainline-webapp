import React, { Component } from 'react';
import AutoForm from 'react-auto-form';
import { withRouter } from 'react-router';

import styled from 'styled-components';
import { Layer, Box, Heading, Paragraph, Button, TextInput } from 'grommet';
import { Close } from 'grommet-icons';

import { Constants } from 'chainline-js';

import { Field } from './';

const ErrorMsg = styled(Paragraph)` color: red; `;

const CITIES = ['Shanghai', 'London', 'Geneva'];

class TrackingLayer extends Component {
  state = {
    isInvalid: false,
    pickUpCity: null,
    dropOffCity: null,
    pickUpCitySuggestions: [],
    dropOffCitySuggestions: [],
  }

  _onSubmit = async (ev, data) => {
    const { onClose, history } = this.props;
    const { trackingId, pickUpCity, dropOffCity } = data;
    ev.preventDefault();
    if (!trackingId || !pickUpCity || !dropOffCity ||
        trackingId.length !== Constants.TRACKING_ID_SIZE * 2) {
      this.setState({ isInvalid: true });
      return;
    }
    history.push(`/track/${trackingId}/${pickUpCity}/${dropOffCity}`);
    onClose();
  }

  render() {
    const {
      isInvalid,
      pickUpCity,
      dropOffCity,
      pickUpCitySuggestions,
      dropOffCitySuggestions,
    } = this.state;
    const { onClose } = this.props;

    return (<Layer align='top' onEsc={onClose} size='medium'>
      <Box align='end'>
        <Button icon={<Close />} onClick={onClose} />
      </Box>
      <Box direction='row' justify='center'>
        <Box basis='medium' margin={{ vertical: 'none', horizontal: 'large' }}>
          <AutoForm onSubmit={this._onSubmit}>
            <Box>
              <Heading level={2} margin='none'>
                Track a Shipment
              </Heading>
              <Box margin={{ vertical: 'medium', horizontal: 'none', bottom: 'large' }}>
                <Paragraph margin={{ bottom: 'medium' }}>
                  You will need your tracking ID.{' '}
                  This is the one provided when registering a demand or travel.
                </Paragraph>
                {isInvalid ? <ErrorMsg>
                  Please fill out all fields!
                </ErrorMsg> : null}
                <Field label='Tracking ID'>
                  <TextInput
                    name='trackingId'
                    placeholder='e.g. b1910c5a00a25c7e02'
                    plain={true}
                    autoFocus={true}
                  />
                </Field>
                <Field label='Collection city'>
                  <TextInput
                    name='pickUpCity'
                    placeholder='e.g. Tokyo'
                    suggestions={pickUpCitySuggestions}
                    onSelect={
                      ({ suggestion }) => this.setState({ pickUpCity: suggestion })
                    }
                    onInput={event => this.setState({
                      pickUpCity: event.target.value,
                      pickUpCitySuggestions: event.target.value.length < 3 ? ['Please enter more text'] : CITIES.filter(
                        city => city.match(new RegExp(`^${event.target.value}`, 'i'))
                      ),
                    })}
                    value={pickUpCity}
                    plain={true}
                  />
                </Field>
                <Field label='Destination city'>
                  <TextInput
                    name='dropOffCity'
                    placeholder='e.g. London'
                    suggestions={dropOffCitySuggestions}
                    onSelect={
                      ({ suggestion }) => this.setState({ dropOffCity: suggestion })
                    }
                    onInput={event => this.setState({
                      dropOffCity: event.target.value,
                      dropOffCitySuggestions: event.target.value.length < 3 ? ['Please enter more text'] : CITIES.filter(
                        city => city.match(new RegExp(`^${event.target.value}`, 'i'))
                      ),
                    })}
                    value={dropOffCity}
                    plain={true}
                  />
                </Field>
                <Box margin={{ top: 'medium' }}>
                  <Button
                    primary={true}
                    type='submit'
                    label='Track Now'
                  />
                </Box>
              </Box>
            </Box>
          </AutoForm>
        </Box>
      </Box>
    </Layer>);
  }
}

export default withRouter(TrackingLayer);
