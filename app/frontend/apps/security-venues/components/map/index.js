import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapWithScript from './map-with-script';
import { GOOGLE_MAPS_KEY, GOOGLE_MAPS_PARAMS } from '../../constants';

class Map extends Component {
  render() {
    return (
      <MapWithScript
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}${GOOGLE_MAPS_PARAMS}`}
        loadingElement={<div>loading</div>}
        containerElement={<div className="boss-form__field" />}
        mapElement={<div className="google-map google-map_adjust_form" />}
        lat={this.props.lat}
        lng={this.props.lng}
        change={this.props.change}
      />
    );
  }
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
};

export default Map;
