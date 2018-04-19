import React, { PureComponent } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import VenueFilter from './requests-venue-filter';
import RotaFilter from '~/components/security-rota/security-rota-filter';
import WeekFilter from './requests-week-filter';

class RequestsFilter extends PureComponent {
  render() {
    const selectedVenues = oFetch(this.props, 'selectedVenues');
    const venueTypes = oFetch(this.props, 'venueTypes');
    const selectVenue = oFetch(this.props, 'selectVenue');
    return (
      <div className="boss-page-main__filter">
        <div className="boss-form">
          <div className="boss-form__row  boss-form__row_justify_space">
            <VenueFilter 
            onChangeSelectedVenues={selectVenue}
            selectedVenues={selectedVenues}
            venueTypes={venueTypes.toJS()}
            />
            <RotaFilter page="requests" currentRotaDay="19-09-2017" />
          </div>
          <WeekFilter
            date={this.props.date}
            onChange={this.props.changeWeekDay}
            weekDates={this.props.weekDates.toJS()}
          />
        </div>
      </div>
    );
  }
}

RequestsFilter.propTypes = {
  changeWeekDay: PropTypes.func.isRequired,
  selectVenue: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  weekDates: ImmutablePropTypes.list.isRequired,
  selectedVenues: PropTypes.array.isRequired,
  venueTypes: ImmutablePropTypes.list.isRequired,
};

export default RequestsFilter;
