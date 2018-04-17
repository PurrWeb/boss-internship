import { createSelector } from 'reselect';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import moment from 'moment';
import RotaDate from '~/lib/rota-date';
import getVenueColor from '~/lib/get-venue-color';

export const startDateSelector = state =>
  oFetch(state.get('page'), 'startDate');
export const chosenDateSelector = state =>
  oFetch(state.get('page'), 'chosenDate');
export const selectedVenuesSelector = state =>
  oFetch(state.get('page'), 'selectedVenues');
export const securityShiftRequestsSelector = state =>
  state.get('shiftRequests');
export const venuesSelector = state => state.get('venues');

export const getShiftRequestForEachWeekDay = createSelector(
  startDateSelector,
  securityShiftRequestsSelector,
  (uiDate, securityShiftRequests) => {
    const date = safeMoment.uiDateParse(uiDate);

    return Immutable.List([1, 2, 3, 4, 5, 6, 7, 8]).map(weekDay => {
      if (weekDay === 8) {
        return Immutable.Map({
          weekDay: 'All',
          date: 'All',
          count: securityShiftRequests.size,
          shiftRequests: securityShiftRequests,
        });
      }
      const currentDate = date.isoWeekday(weekDay);

      const shiftRequests = securityShiftRequests.filter(shiftRequest => {
        const currentRotaDate = new RotaDate({
          dateOfRota: currentDate.toDate(),
        });
        return currentRotaDate.isShiftBelongsToRotaDay({
          shiftStartsAt: shiftRequest.get('startsAt'),
        });
      });
      const count = shiftRequests.size;
      return Immutable.Map({
        weekDay: currentDate.format('dddd'),
        date: currentDate.format('DD-MM-YYYY'),
        count,
        shiftRequests,
      });
    });
  },
);

export const getShiftRequestsForChosenDate = createSelector(
  chosenDateSelector,
  selectedVenuesSelector,
  getShiftRequestForEachWeekDay,
  venuesSelector,
  (chosenDate, selectedVenues, shiftRequestsForEachWeekDay, venues) => {
    if (selectedVenues.length === 0) {
      return shiftRequestsForEachWeekDay
        .find(day => day.get('date') === chosenDate)
        .get('shiftRequests')
        .map(shiftRequest =>
          shiftRequest.set(
            'venueName',
            venues
              .find(venue => venue.get('id') === shiftRequest.get('venueId'))
              .get('name'),
          ),
        );
    } else {
      return shiftRequestsForEachWeekDay
        .find(day => day.get('date') === chosenDate)
        .get('shiftRequests')
        .filter(shiftRequest =>
          selectedVenues.includes(shiftRequest.get('venueId')),
        )
        .map(shiftRequest =>
          shiftRequest.set(
            'venueName',
            venues
              .find(venue => venue.get('id') === shiftRequest.get('venueId'))
              .get('name'),
          ),
        );
    }
  },
);

export const getWeekDaysWithCount = createSelector(
  selectedVenuesSelector,
  getShiftRequestForEachWeekDay,
  (selectedVenues, shiftRequestsForEachWeekDay) => {
    if (selectedVenues.length === 0) {
      return shiftRequestsForEachWeekDay.map(day =>
        Immutable.Map({
          weekDay: day.get('weekDay'),
          date: day.get('date'),
          count: day.get('count'),
        }),
      );
    } else {
      return shiftRequestsForEachWeekDay.map(day => {
        const count = day
          .get('shiftRequests')
          .filter(shiftRequest =>
            selectedVenues.includes(shiftRequest.get('venueId')),
          ).size;
        return Immutable.Map({
          weekDay: day.get('weekDay'),
          date: day.get('date'),
          count,
        });
      });
    }
  },
);

export const getVenueTypes = createSelector(
  venuesSelector,
  securityShiftRequestsSelector,
  (venues, shiftRequests) => {
    return venues
      .map(venue => {
        return venue.set('color', getVenueColor(venue.get('id')));
      })
      .filter(venue =>
        shiftRequests
          .groupBy(shiftRequest => shiftRequest.get('venueId'))
          .has(venue.get('id')),
      );
  },
);
