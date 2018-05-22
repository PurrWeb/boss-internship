import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class Day extends Component {
  renderItems(shiftsByVenue) {
    const venueShiftsRenderer = oFetch(this.props, 'venueShiftsRenderer');
    return shiftsByVenue.map((venueShifts, venueId) => {
      return React.cloneElement(venueShiftsRenderer({ venueShifts, venueId }), {
        key: venueId.toString(),
      });
    }).toArray();
  }

  render() {
    const shiftsByVenue = oFetch(this.props, 'shiftsByVenue');
    const date = oFetch(this.props, 'date');
    return (
      <li className="boss-timeline__item boss-timeline__item_role_card">
        <div className="boss-timeline__inner boss-timeline__inner_role_card">
          <div className="boss-timeline__header boss-timeline__header_role_card">
            <h3 className="boss-timeline__title">
              <span className="boss-timeline__title-primary">{date}</span>
            </h3>
          </div>
          <div className="boss-timeline__content boss-timeline__content_role_card">
            {this.renderItems(shiftsByVenue)}
          </div>
        </div>
      </li>
    );
  }
}

Day.propTypes = {};

export default Day;
