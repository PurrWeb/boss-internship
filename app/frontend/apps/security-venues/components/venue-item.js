import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Venue } from '../models';
import oFetch from 'o-fetch';

class VenueItem extends Component {
  render() {
    const venue = oFetch(this.props, 'venue');
    const onEditClick = oFetch(this.props, 'onEditClick');
    const name = oFetch(venue, 'name');
    const address = oFetch(venue, 'address');
    return (
      <div className="boss-check boss-check_role_board boss-check_page_security-venues">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <h3 className="boss-check__title boss-check__title_role_venue boss-check__title_adjust_wrap">{name}</h3>
          </div>
        </div>
        <div className="boss-check__row boss-check__row_marked">
          <div className="boss-check__cell">
            <p className="boss-check__text boss-check__text_role_location">{address}</p>
            <a
              href={`https://www.google.com/maps/place/${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="boss-button boss-button_role_view-details-light boss-button_type_extra-small boss-check__button  boss-check__button_position_below"
            >
              View on Google Maps
            </a>
          </div>
        </div>
        <div className="boss-check__row boss-check__row_role_buttons">
          <button
            onClick={onEditClick}
            type="button"
            className="boss-button boss-button_role_edit boss-button_type_small boss-check__button"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }
}

VenueItem.propTypes = {
  venue: PropTypes.instanceOf(Venue).isRequired,
  onEditClick: PropTypes.func.isRequired,
};

export default VenueItem;
