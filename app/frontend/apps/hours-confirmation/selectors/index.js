import { createSelector } from 'reselect';
import { List, Map, Set, fromJS } from 'immutable';
import safeMoment from '~/lib/safe-moment';

export const periodPermissionSelector = (state, id) => {
  const permission = state
    .getIn(['pageOptions', 'userPeriodsPermissions'])
    .find(periodPermission => periodPermission.get('id') === id);

  if (!permission) {
    throw new Error(
      `Permission for hours acceptance period with id: ${id}, must be present`,
    );
  }

  return permission.get('permitted');
};

const venuesSelector = state => state.get('venues');
const rotaShiftsSelector = state => state.get('rotaShifts');
const staffMembersSelector = state => state.get('staffMembers');
const clockInPeriodsSelector = state => state.get('clockInPeriods');
const clockInBreaksSelector = state => state.get('clockInBreaks');
const clockInEventsSelector = state => state.get('clockInEvents');
const clockInNotesSelector = state => state.get('clockInNotes');
const hoursAcceptancePeriodsSelector = state =>
  state.get('hoursAcceptancePeriods');
const hoursAcceptanceBreaksSelector = state =>
  state.get('hoursAcceptanceBreaks');
const rotasSelector = state => state.get('rotas');

export const getVenueByIdSelector = createSelector(
  venuesSelector,
  venues => venueId => venues.find(venue => venue.get('id') === venueId),
);

export function addZeroToNumber(number, zeroLimit = 9) {
  return number <= zeroLimit ? `0${number}` : `${number}`;
}

export function formattedTime(timeInMs) {
  const hours = Math.trunc(timeInMs / 1000 / 60 / 60);
  const minutes = Math.trunc((timeInMs / 1000 / 60) % 60);

  if (hours === 0 && minutes === 0) {
    return 0;
  }
  return `${hours === 0 ? '' : `${hours}h`}${
    minutes === 0 ? '' : `${addZeroToNumber(minutes, 9)}m`
  }`;
}

export function getItemTimeDiff(item) {
  if (item.endsAt === null) return 0;
  const mStartsAt = safeMoment.iso8601Parse(item.startsAt).seconds(0);
  const mEndsAt = safeMoment.iso8601Parse(item.endsAt).seconds(0);
  return mEndsAt.diff(mStartsAt);
}

export function getItemsTimeDiff(items) {
  return items.reduce((acc, item) => {
    return acc + getItemTimeDiff(item);
  }, 0);
}

export const data = createSelector(
  clockInPeriodsSelector,
  staffMembersSelector,
  rotaShiftsSelector,
  clockInBreaksSelector,
  rotasSelector,
  hoursAcceptancePeriodsSelector,
  clockInEventsSelector,
  hoursAcceptanceBreaksSelector,
  clockInNotesSelector,
  (
    clockInPeriods,
    staffMembers,
    rotaShifts,
    clockInBreaks,
    rotas,
    hoursAcceptancePeriods,
    clockInEvents,
    hoursAcceptanceBreaks,
    clockInNotes,
  ) =>
    clockInPeriods
      .groupBy(x => x.get('date'))
      .map((periodsInDate, periodsDate) => {
        const mDate = safeMoment.uiDateParse(periodsDate);
        const rotasOnDate = rotas.filter(rota => safeMoment.uiDateParse(rota.get('date')).isSame(mDate));
        return periodsInDate
          .groupBy(x => x.get('venue'))
          .map((periodsInVenue, periodVenueId) => {
            return periodsInVenue
              .groupBy(x => x.get('staffMember'))
              .map((periodsInStaffMember, staffMemberId) => {
                const events = periodsInStaffMember
                  .reduce(
                    (acc, item) => acc.concat(item.get('clockInEvents')),
                    List([]),
                  )
                  .map(eventId =>
                    clockInEvents.find(event => event.get('id') === eventId),
                  );

                const periods = Map({})
                  .set('venueId', periodVenueId)
                  .set(
                    'staffMember',
                    staffMembers.find(
                      staffMember => staffMember.get('id') === staffMemberId,
                    ),
                  )
                  .set('clockInNotes', clockInNotes.filter(note => note.get('staffMember') === staffMemberId && note.get('date') === periodsDate))
                  .set('clockInEvents', events)
                  .update('rotaedShifts', () => {
                    if (rotasOnDate.size === 0) {
                      return List([]);
                    }
                    return rotaShifts
                      .filter(
                        shift => {
                          const rota = rotasOnDate.find(rota => shift.get('rota') === rota.get('id'));
                          return shift.get('staffMember') === staffMemberId && rota;
                        },
                      )
                      .map(item => item.set('breaks', []));
                  })
                  .set(
                    'hoursAcceptancePeriods',
                    hoursAcceptancePeriods
                      .filter(
                        item =>
                          safeMoment
                            .uiDateParse(item.get('date'))
                            .isSame(mDate) &&
                          item.get('staffMember') === staffMemberId,
                      )
                      .map(hoursAcceptancePeriod => {
                        return hoursAcceptancePeriod.set(
                          'breaks',
                          hoursAcceptanceBreaks.filter(
                            hoursAcceptanceBreak =>
                              hoursAcceptanceBreak.get(
                                'hoursAcceptancePeriod',
                              ) === hoursAcceptancePeriod.get('frontendId'),
                          ),
                        );
                      }),
                  )
                  .set(
                    'clockInPeriods',
                    periodsInStaffMember.map(periodInStaffMember =>
                      periodInStaffMember.set(
                        'breaks',
                        periodInStaffMember
                          .get('clockInBreaks')
                          .map(clockInBreakId =>
                            clockInBreaks.find(
                              clockInBreak =>
                                clockInBreak.get('id') === clockInBreakId,
                            ),
                          ),
                      ),
                    ),
                  );

                const acceptedAcceptancePeriods = periods
                  .get('hoursAcceptancePeriods')
                  .filter(item => item.get('status') === 'accepted');
                const periodsWithStats = periods
                  .set(
                    'hoursAcceptanceStats',
                    getItemsTimeDiff(acceptedAcceptancePeriods.toJS()),
                  )
                  .set(
                    'hoursAcceptanceBreaksStats',
                    acceptedAcceptancePeriods.reduce((acc, item) => {
                      return acc + getItemsTimeDiff(item.get('breaks').toJS());
                    }, 0),
                  )
                  .set(
                    'clockedStats',
                    getItemsTimeDiff(periods.get('clockInPeriods').toJS()),
                  )
                  .set(
                    'clockedBreaksStats',
                    periods.get('clockInPeriods').reduce((acc, item) => {
                      return acc + getItemsTimeDiff(item.get('breaks').toJS());
                    }, 0),
                  )
                  .set(
                    'rotaedStats',
                    getItemsTimeDiff(periods.get('rotaedShifts').toJS()),
                  );

                return periodsWithStats;
              });
          });
      }),
);
