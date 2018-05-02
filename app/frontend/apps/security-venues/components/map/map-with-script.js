import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';

class Map extends Component {
  handleDragEnd = () => {
    const { change } = this.props;
    const lat = this.marker.getPosition().lat();
    const lng = this.marker.getPosition().lng();
    change('lat', lat);
    change('lng', lng);
  };

  render() {
    const { lng, lat } = this.props;
    const position = { lng, lat };
    const defaultCenter = { lat: 51.509865, lng: -0.118092 };
    const center = !!lng && !!lat ? position : defaultCenter;

    return (
      <GoogleMap defaultZoom={16} center={center}>
        {!!lng &&
          !!lat && <Marker ref={el => (this.marker = el)} draggable position={position} onDragEnd={this.handleDragEnd} />}
      </GoogleMap>
    );
  }
}

Map.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
};

export default withScriptjs(withGoogleMap(Map));
