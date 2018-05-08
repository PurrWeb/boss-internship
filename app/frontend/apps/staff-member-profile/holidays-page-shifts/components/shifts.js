import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import URLSearchParams from 'url-search-params';

import ProfileWrapper from '../../profile-wrapper';
import ShiftsFilter from './shifts-filter';
import DayList from './day-list';
import ShiftList from './shift-list';
import Shift from './shift';

const shiftsByDays = [
  {
    date: 'Tuesday, 15 November 2016',
    shifts: [
      {
        id: 1,
        venueName: 'Venue Name',
        rotaed: '2h',
        accepted: '0h',
        fromTo: '11:00 - 13:00',
      },
      {
        id: 2,
        venueName: 'Venue Name',
        rotaed: '2h',
        accepted: '0h',
        fromTo: '11:00 - 13:00',
      },
      {
        id: 3,
        venueName: 'Venue Name',
        rotaed: '2h',
        accepted: '0h',
        fromTo: '11:00 - 13:00',
        breaks: '1h 00min',
        acceptedBy: 'John Doe',
        acceptedOn: '15/11/2016',
      },
    ],
  },
  {
    date: 'Monday, 14 November 2016',
    shifts: [
      {
        id: 4,
        venueName: 'Venue Name',
        rotaed: '2h',
        accepted: '0h',
        fromTo: '11:00 - 13:00',
        breaks: '1h 00min',
        acceptedBy: 'John Doe',
        acceptedOn: '15/11/2016',
      },
    ],
  },
];

class Shifts extends Component {
  onFilter = (values) => {
    const queryString = new URLSearchParams(window.location.search);
    queryString.delete('startDate');
    queryString.delete('endDate');
    queryString.delete('venueId');
  
    for (let value in values) {
      if (values[value]) {
        queryString.set(value, values[value]);
      }
    }
    window.history.pushState('state', 'title', `?${queryString}`);
    console.log(values);
  }

  render() {
    const venues = oFetch(this.props, 'venues');
    return (
      <ProfileWrapper currentPage="shifts">
        <section className="boss-board">
          <header className="boss-board__header">
            <h2 className="boss-board__title">Shifts</h2>
          </header>
          <div className="boss-board__main">
            <div className="boss-board__manager">
              <div className="boss-board__manager-group boss-board__manager-group_role_data">
                <ShiftsFilter
                  onFilter={this.onFilter}
                  venues={venues.toJS()}
                />
                <DayList
                  shiftsByDays={Immutable.fromJS(shiftsByDays)}
                  dayRenderer={rotaShifts => {
                    return <ShiftList rotaShifts={rotaShifts} shiftRenderer={shift => <Shift shift={shift} />} />;
                  }}
                />
                <div className="boss-board__manager-actions">
                  <button className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile">
                    Load More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProfileWrapper>
    );
  }
}

Shifts.propTypes = {
  venues: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default Shifts;
