import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import loadMore from '~/components/load-more'

class DayList extends Component {
  renderItems(shiftsByDateAndVenue) {
    const dayRenderer = oFetch(this.props, 'dayRenderer');

    return shiftsByDateAndVenue.map((shiftsByVenue, date) => {
      return React.cloneElement(dayRenderer({ shiftsByVenue, date }), {
        key: date.toString(),
      });
    }).toArray();
  }
  render() {
    const shiftsByDateAndVenue = oFetch(this.props, 'shiftsByDateAndVenue');
    const hasShiftsByDateAndVenue = shiftsByDateAndVenue.size > 0;
    return (
      <div className="boss-board__manager-timeline">
        <div className="boss-timeline boss-timeline_role_shifts">
          {hasShiftsByDateAndVenue && (
            <ul className="boss-timeline__list">{this.renderItems(shiftsByDateAndVenue)}</ul>
          )}
          {!hasShiftsByDateAndVenue && (
            <div className="boss-page-main__text-placeholder">No shifts found</div>
          )}
        </div>
      </div>
    );
  }
}

DayList.propTypes = {};

export default loadMore(DayList);
