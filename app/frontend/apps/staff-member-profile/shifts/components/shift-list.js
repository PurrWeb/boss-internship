import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class ShiftList extends Component {
  renderItems(shifts) {
    const shiftRenderer = oFetch(this.props, 'shiftRenderer');
    return shifts.map((shift) => {
      return React.cloneElement(shiftRenderer(shift.toJS()), {
        key: shift.get('id').toString(),
      });
    });
  }

  render() {
    const shifts = oFetch(this.props, 'shifts');
    return (
      <div className="boss-timeline__records">{this.renderItems(shifts)}</div>
    );
  }
}

ShiftList.propTypes = {};

export default ShiftList;
