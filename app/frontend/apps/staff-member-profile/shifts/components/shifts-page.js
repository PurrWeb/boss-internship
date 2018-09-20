import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import URLSearchParams from 'url-search-params';

import ProfileWrapper from '../../profile-wrapper';
import ShiftsFilter from './shifts-filter';
import DayList from './day-list';
import Day from './day';
import VenueShifts from './venue-shifts';


class Shifts extends Component {
  onFilter = ({ venue_id, ...values }) => {
    const queryString = new URLSearchParams(window.location.search);
    queryString.delete('start_date');
    queryString.delete('end_date');
    queryString.delete('venue_id');
    queryString.delete('venue_type');
    const [venueType, stringVenueId] = venue_id ? venue_id.split('_') : [null, null];
    const mappedValues = { ...values, venue_id: Number(stringVenueId), venue_type: venueType };
    for (let value in mappedValues) {
      if (mappedValues[value]) {
        queryString.set(value, mappedValues[value]);
      }
    }
    const link = `${window.location.href.split('?')[0]}?${queryString.toString()}`
    window.location.href = link;
  }

  render() {
    const venues = oFetch(this.props, 'venues');
    const pageOptions = oFetch(this.props, 'pageOptions');
    const shiftsByDateAndVenue = oFetch(this.props, 'shiftsByDateAndVenue');
    const staffMemberId = oFetch(this.props, 'staffMemberId');

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
                  pageOptions={pageOptions.toJS()}
                />
                <DayList
                  shiftsByDateAndVenue={shiftsByDateAndVenue}
                  listObjectName="shiftsByDateAndVenue"
                  perPage={20}
                  dayRenderer={({ shiftsByVenue, date }) =>
                    <Day
                      date={date}
                      venues={venues}
                      shiftsByVenue={shiftsByVenue}
                      venueShiftsRenderer={({ venueShifts, venueId }) =>
                        <VenueShifts
                          venueShifts={venueShifts}
                          venueId={venueId}
                          staffMemberId={staffMemberId}
                          date={date}
                        />
                      }
                    />
                  }
                />
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
