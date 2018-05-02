import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Geocode from 'react-geocode';
import { GEOCODE_GOOGLE_API} from '../constants';

Geocode.setApiKey(GEOCODE_GOOGLE_API);

class AddressToLatLng extends Component {
  componentWillReceiveProps(nextProps) {
    const { change } = this.props;
    if (this.props.address !== nextProps.address) {
      Geocode.fromAddress(nextProps.address).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          change('lat', Number(lat));
          change('lng', Number(lng));
        },
        error => {
          change('lat', null);
          change('lng', null);
        },
      );
    }
  }

  render() {
    return null;
  }
}

AddressToLatLng.propTypes = {
  address: PropTypes.string,
  change: PropTypes.func.isRequired,
};

export default AddressToLatLng;
