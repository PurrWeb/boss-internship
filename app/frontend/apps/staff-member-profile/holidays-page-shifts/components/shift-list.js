import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class ShiftList extends Component {
  renderItems(shifts) {
    const shiftRenderer = oFetch(this.props, 'shiftRenderer');
    return shifts.map(shift => {
      return React.cloneElement(shiftRenderer(shift), {
        key: shift.get('id').toString(),
      });
    });
  }

  render() {
    const rotaShifts = oFetch(this.props, 'rotaShifts');
    const date = rotaShifts.get('date');
    const shifts = rotaShifts.get('shifts');
    return (
      <li className="boss-timeline__item boss-timeline__item_role_card">
        <div className="boss-timeline__inner boss-timeline__inner_role_card">
          <div className="boss-timeline__header boss-timeline__header_role_card">
            <h3 className="boss-timeline__title">
              <span className="boss-timeline__title-primary">{date}</span>
            </h3>
          </div>
          <div className="boss-timeline__content boss-timeline__content_role_card">
            <div className="boss-timeline__records">{this.renderItems(shifts)}</div>
          </div>
        </div>
      </li>
    );
  }
}

ShiftList.propTypes = {};

export default ShiftList;
