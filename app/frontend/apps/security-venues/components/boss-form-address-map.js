import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Fields } from 'redux-form';
import { BossFormInput } from '~/components/boss-form';

import Map from './map';
import AddressToLatLng from './address-to-lat-lng';

class BossFormAddressMap extends Component {
  render() {
    const { address, lat, lng } = this.props;

    return (
      <div className="boss-form__field">
        <input {...lat.input} type="hidden" />
        <input {...lng.input} type="hidden" />
        <Field {...address} name={address.input.name} label="Address" required component={BossFormInput} />
        <AddressToLatLng change={this.props.change} address={address.input.value} />
        <Map lat={Number(lat.input.value)} lng={Number(lng.input.value)} change={this.props.change} />
      </div>
    );
  }
}

BossFormAddressMap.propTypes = {};

export default BossFormAddressMap;
