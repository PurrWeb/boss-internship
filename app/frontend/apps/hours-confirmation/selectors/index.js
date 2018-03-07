import { createSelector } from 'reselect';
import { List, Map, Set } from 'immutable';
import safeMoment from '~/lib/safe-moment';

function keyIn(...keys) {
  var keySet = Set(keys);
  return function(v, k) {
    return keySet.has(k);
  };
}

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

export function getTimeDiff(items) {
  const diff = items.reduce((acc, item) => {
    if (item.endsAt === null) return 0;
    const mStartsAt = safeMoment.iso8601Parse(item.startsAt);
    const mEndsAt = safeMoment.iso8601Parse(item.endsAt);
    return acc + mEndsAt.diff(mStartsAt);
  }, 0);
  const hours = Math.trunc(diff / 1000 / 60 / 60);
  const minutes = Math.trunc((diff / 1000 / 60) % 60);
  return {
    fullTime: `${addZeroToNumber(hours, 9)}h${addZeroToNumber(minutes, 9)}m`,
    zeroHours: `${addZeroToNumber(hours, 9)}`,
    zeroMinutes: `${addZeroToNumber(minutes, 9)}`,
    hours: hours,
    minutes: minutes,
  };
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

            return Map({})
              .set(
                'staffMember',
                staffMembers.find(
                  staffMember => staffMember.get('id') === staffMemberId,
                ),
              )
              .set('clockInEvents', events)
              .set(
                'rotaedShifts',
                rotaShifts.filter(
                  shift =>
                    shift.get('staffMember') === staffMemberId &&
                    shift.get('rota') === rota.get('id'),
                ),
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
                      hoursAcceptancePeriod
                        .get('hoursAcceptanceBreaks')
                        .map(hoursAcceptanceBreakId =>
                          hoursAcceptanceBreaks.find(
                            hoursAcceptanceBreak =>
                              hoursAcceptanceBreak.get('id') ===
                              hoursAcceptanceBreakId,
                          ),
                        ),
                    );
                  }),
              )
              .set(
                'hoursAcceptanceStats',
                getTimeDiff(
                  hoursAcceptancePeriods.filter(
                    item =>
                      safeMoment.uiDateParse(item.get('date')).isSame(mDate) &&
                      item.get('staffMember') === staffMemberId,
                  ).toJS(),
                ),
              )
              .set('clockedStats', getTimeDiff(periodsInStaffMember.toJS()))
              .set(
                'rotaedStats',
                getTimeDiff(
                  rotaShifts.filter(
                    shift =>
                      shift.get('staffMember') === staffMemberId &&
                      shift.get('rota') === rota.get('id'),
                  ).toJS(),
                ),
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
          });
      }),
);
