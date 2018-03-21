import { createSelector } from 'reselect';
import { List, Map, Set } from 'immutable';
import safeMoment from '~/lib/safe-moment';
import uuid from 'uuid/v1';
import oFetch from 'o-fetch';

function keyIn(...keys) {
  var keySet = Set(keys);
  return function(v, k) {
    return keySet.has(k);
  };
}

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

const rotaShiftsSelector = state => state.get('rotaShifts');
const staffMembersSelector = state => state.get('staffMembers');
const clockInPeriodsSelector = state => state.get('clockInPeriods');
const clockInBreaksSelector = state => state.get('clockInBreaks');
const clockInEventsSelector = state => state.get('clockInEvents');
const hoursAcceptancePeriodsSelector = state =>
  state.get('hoursAcceptancePeriods');
const hoursAcceptanceBreaksSelector = state =>
  state.get('hoursAcceptanceBreaks');
const rotasSelector = state => state.get('rotas');

export function addZeroToNumber(number, zeroLimit = 9) {
  return number <= zeroLimit ? `0${number}` : `${number}`;
}

export function formattedTime(timeInMs) {
  const hours = Math.trunc(timeInMs / 1000 / 60 / 60);
  const minutes = Math.trunc((timeInMs / 1000 / 60) % 60);

  if (hours === 0 && minutes === 0) {
    return `N/A`;
  }
  return `${hours === 0 ? '' : `${hours}h`}${
    minutes === 0 ? '' : `${addZeroToNumber(minutes, 9)}m`
  }`;
}

export function getItemTimeDiff(item) {
  if (item.endsAt === null) return 0;
  const mStartsAt = safeMoment.iso8601Parse(item.startsAt);
  const mEndsAt = safeMoment.iso8601Parse(item.endsAt);
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
  (
    clockInPeriods,
    staffMembers,
    rotaShifts,
    clockInBreaks,
    rotas,
    hoursAcceptancePeriods,
    clockInEvents,
    hoursAcceptanceBreaks,
  ) =>
    clockInPeriods
      .groupBy(x => x.get('date'))
      .map((periodsInDate, periodsDate) => {
        const mDate = safeMoment.uiDateParse(periodsDate);
        const rota = rotas.find(rota =>
          safeMoment.uiDateParse(rota.get('date')).isSame(mDate),
        );
        return periodsInDate
          .groupBy(x => x.get('staffMember'))
          .map((periodsInStaffMember, staffMemberId) => {
            const events = periodsInStaffMember
              .reduce(
                (acc, item) => acc.merge(item.get('clockInEvents')),
                List([]),
              )
              .map(eventId =>
                clockInEvents.find(event => event.get('id') === eventId),
              );

            const periods = Map({})
              .set(
                'staffMember',
                staffMembers.find(
                  staffMember => staffMember.get('id') === staffMemberId,
                ),
              )
              .set('clockInEvents', events)
              .set(
                'rotaedShifts',
                rotaShifts
                  .filter(
                    shift =>
                      shift.get('staffMember') === staffMemberId &&
                      shift.get('rota') === rota.get('id'),
                  )
                  .map(item => item.set('breaks', [])),
              )
              .set(
                'hoursAcceptancePeriods',
                hoursAcceptancePeriods
                  .filter(
                    item =>
                      safeMoment.uiDateParse(item.get('date')).isSame(mDate) &&
                      item.get('staffMember') === staffMemberId,
                  )
                  .map(hoursAcceptancePeriod => {
                    return hoursAcceptancePeriod.set(
                      'breaks',
                      hoursAcceptanceBreaks.filter(
                        hoursAcceptanceBreak =>
                          hoursAcceptanceBreak.get('hoursAcceptancePeriod') ===
                          hoursAcceptancePeriod.get('frontendId'),
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
      }),
);
