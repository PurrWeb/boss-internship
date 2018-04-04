import PropTypes from 'prop-types';
import React from 'react';
import utils from '~/lib/utils';
import Spinner from '~/components/spinner';
import getVenueColor from '~/lib/get-venue-color';
import ComponentErrors from '~/components/component-errors';

export default class SecurityRotaStaffCount extends React.Component {
  render() {
    return (
      <div className="boss-board__staff-count">
        <div className="boss-overview boss-overview_page_security-rota-weekly">
          <div className="boss-overview__header">
            <h3 className="boss-overview__title">Staff Count</h3>
          </div>
          <ul className="boss-overview__list">{this.getStaffCountList()}</ul>
        </div>
      </div>
    );
  }

  getStaffCountList() {
    const { venueStaffCountList } = this.props;
    return venueStaffCountList.map(venue => (
      <li key={venue.id} className="boss-overview__list-item">
        <p className="boss-overview__list-name">
          <span
            className="boss-overview__list-pointer"
            style={{ backgroundColor: getVenueColor(venue.id) }}
          />{' '}
          {venue.name}
        </p>
        <p className="boss-overview__list-number">{venue.count}</p>
      </li>
    ));
  }
}

SecurityRotaStaffCount.PropTypes = {
  venueStaffCountList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
