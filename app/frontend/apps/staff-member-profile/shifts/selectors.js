import { createSelector } from 'reselect';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';
import getVenueColor from '~/lib/get-venue-color';
import utils, { BOSS_VENUE_TYPE } from '~/lib/utils'

import { HoursAcceptancePeriod, VenueShifts, RotaShift, HoursAcceptanceBreak } from './models'

export const venuesSelector = state => state.get('venues');
export const rotaShiftsSelector = state => state.get('rotaShifts');
export const hoursAcceptancePeriodsSelector = state => state.get('hoursAcceptancePeriods');
export const hoursAcceptanceBreaksSelector = state => state.get('hoursAcceptanceBreaks');
export const staffMemberIdSelector = state => state.getIn(['profile', 'staffMember', 'id']);

export const getVenuesWithColor = createSelector(
  venuesSelector,
  (venues) => venues.map(venue => venue.set('color', getVenueColor(venue.get('id')))),
);

export const getMappedHoursAcceptancePeriods = createSelector(
  hoursAcceptancePeriodsSelector,
  hoursAcceptanceBreaksSelector,
  venuesSelector,
  (hoursAcceptancePeriods, hoursAcceptanceBreaks, venues) => {
    return hoursAcceptancePeriods.groupBy(x => x.get('date'))
      .map((hoursAcceptancePeriodsInDate, hoursAcceptancePeriodDate) => hoursAcceptancePeriodsInDate.groupBy(x => `${BOSS_VENUE_TYPE}_${x.get('venueId')}`)
        .map((hoursAcceptancePeriodsInVenue, venueCombinedId) => {
          const [venueType, stringVenueId] = venueCombinedId.split('_');
          const periodVenueId = Number(stringVenueId);

          const venue = venues.find(venue => {
            return venue.get('id') === periodVenueId && venue.get('type') === venueType
          });
          if (!venue) {
            throw new Error('Unknow venue');
          }
          const venueName = venue.get('name');
          return hoursAcceptancePeriodsInVenue.reduce((acc, hoursAcceptancePeriod) => {
            const sFromTimeFormatted = safeMoment.iso8601Parse(hoursAcceptancePeriod.get('startsAt')).format(utils.commonDateFormatTimeOnly());
            const sToTimeFormatted = safeMoment.iso8601Parse(hoursAcceptancePeriod.get('endsAt')).format(utils.commonDateFormatTimeOnly());
            const mappedHoursAcceptancePeriod = new HoursAcceptancePeriod({
              id: hoursAcceptancePeriod.get('id'),
              date: hoursAcceptancePeriod.get('date'),
              startsAt: hoursAcceptancePeriod.get('startsAt'),
              endsAt: hoursAcceptancePeriod.get('endsAt'),
              acceptedBy: hoursAcceptancePeriod.get('acceptedBy'),
              acceptedAt: hoursAcceptancePeriod.get('acceptedAt'),
              formattedFromTo: `${sFromTimeFormatted} - ${sToTimeFormatted}`,
              breaks: hoursAcceptanceBreaks
                .filter(hoursAcceptanceBreak => hoursAcceptanceBreak.get('hoursAcceptancePeriodId') === hoursAcceptancePeriod.get('id'))
                .map(hoursAcceptanceBreak => new HoursAcceptanceBreak({
                  id: hoursAcceptanceBreak.get('id'),
                  startsAt: hoursAcceptanceBreak.get('startsAt'),
                  endsAt: hoursAcceptanceBreak.get('endsAt'),
                }))
            })

            return acc.update('hoursAcceptancePeriods', venueHoursAcceptancePeriods => venueHoursAcceptancePeriods.push(mappedHoursAcceptancePeriod));
          }, new VenueShifts({ venueName: venueName })
          )
        }))
  });

export const getMappedRotaShifts = createSelector(
  rotaShiftsSelector,
  venuesSelector,
  (rotaShifts, venues) => {
    return rotaShifts
      .groupBy(x => x.get('date'))
      .map((rotaShiftsInDate, rotaShiftDate) => rotaShiftsInDate.groupBy(x => `${x.get('venueType')}_${x.get('venueId')}`)
        .map((rotaShiftsInVenue, venueCombinedId) => {
          const [venueType, stringVenueId] = venueCombinedId.split('_');
          const periodVenueId = Number(stringVenueId);
          const venue = venues.find(venue => {
            return venue.get('id') === periodVenueId && venue.get('type') === venueType
          });
          if (!venue) {
            throw new Error('Unknow venue');
          }
          const venueName = venue.get('name');
          return rotaShiftsInVenue
            .sortBy((rotaShift) => safeMoment.iso8601Parse(rotaShift.get('startsAt')).toDate())
            .reduce((acc, rotaShift) => {
              const venue = venues.find(venue => venue.get('id') === periodVenueId);
              if (!venue) {
                throw new Error('Unknow venue');
              }
              const venueName = venue.get('name');
              const sFromTimeFormatted = safeMoment.iso8601Parse(rotaShift.get('startsAt')).format(utils.commonDateFormatTimeOnly());
              const sToTimeFormatted = safeMoment.iso8601Parse(rotaShift.get('endsAt')).format(utils.commonDateFormatTimeOnly());
              const mappedRotaShift = new RotaShift({
                id: rotaShift.get('id'),
                date: rotaShift.get('date'),
                startsAt: rotaShift.get('startsAt'),
                endsAt: rotaShift.get('endsAt'),
                formattedFromTo: `${sFromTimeFormatted} - ${sToTimeFormatted}`
              })
              return acc.update('rotaShifts', venueRotaShifts => venueRotaShifts.push(mappedRotaShift));
            }, new VenueShifts({ venueName: venueName })
            )
        }));
  }
)

export const getShiftsInformation = createSelector(
  getMappedHoursAcceptancePeriods,
  getMappedRotaShifts,
  (hoursAcceptancePeriods, rotaShifts) => {
    return rotaShifts.mergeDeep(hoursAcceptancePeriods).sortBy((venue, date) => safeMoment.uiDateParse(date).toDate())
  })