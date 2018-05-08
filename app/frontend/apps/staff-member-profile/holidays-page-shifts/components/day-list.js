import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class DayList extends Component {
  renderItems(shiftsByDays) {
    const dayRenderer = oFetch(this.props, 'dayRenderer');

    return shiftsByDays.map(rotaShifts => {
      return React.cloneElement(dayRenderer(rotaShifts), {
        key: rotaShifts.get('date').toString(),
      });
    });
  }
  render() {
    const shiftsByDays = oFetch(this.props, 'shiftsByDays');
    return (
      <div className="boss-board__manager-timeline">
        <div className="boss-timeline boss-timeline_role_shifts">
          <ul className="boss-timeline__list">{this.renderItems(shiftsByDays)}</ul>
        </div>
      </div>
    );
  }
}

DayList.propTypes = {};

export default DayList;
