import React, { Component } from 'react';
import { API_KEY } from '../constants';

class MapEmbeded extends Component {
  render() {
    const { query } = this.props;
    const q = encodeURIComponent(query);
    return (
      <div className="boss-form__field">
        <div className="google-map google-map_adjust_form">
          {query && query.length > 0 ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${q}`}
              width="600"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default MapEmbeded;
