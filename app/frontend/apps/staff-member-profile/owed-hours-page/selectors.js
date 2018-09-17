import { createSelector } from 'reselect';
import { OwedHourModel, DurationModel, TimesModel, WeekModel, OwedHoursWeekModel } from './models';
import Immutable from 'immutable';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import RotaWeek from '~/lib/RotaWeek';
import RotaShiftDate from '~/lib/RotaShiftDate';

momentDurationFormatSetup(moment);

export const owedHoursSelector = state => state.getIn(['owedHours', 'owedHours']);

export const getGrouppedByWeekOwedHours = createSelector(owedHoursSelector, owedHours => {
  return owedHours.groupBy(owedHour => new RotaWeek(owedHour.get('date')).toString());
});

export const getOwedHoursWeeks = createSelector(getGrouppedByWeekOwedHours, owedHours => {
  const result = owedHours.reduce((acc, owedHours, owedHoursWeek) => {
    const [weekStartDate, weekEndDate] = owedHoursWeek.split(':');
    const totalMinutes = owedHours.reduce((acc, owedHour) => acc + owedHour.get('minutes'), 0);
    return acc.push(
      new OwedHoursWeekModel({
        week: new WeekModel({
          startDate: weekStartDate,
          endDate: weekEndDate,
          totalHours: moment
            .duration(totalMinutes, 'minutes')
            .format('*hh[ hours] mm[ minutes]', { trim: 'both', useGrouping: false }),
        }),
        owedHours: owedHours
          .map(owedHour => {
            const duration = moment.duration(owedHour.get('minutes'), 'minutes');
            const rotaShiftDate = new RotaShiftDate(owedHour.get('date'));
            let startsAtOffset, endsAtOffset;

            if (owedHour.get('hasDate')) {
              const mStartsAt = safeMoment.iso8601Parse(owedHour.get('startsAt'));
              const mEndsAt = safeMoment.iso8601Parse(owedHour.get('endsAt'));
              const mStartTime = safeMoment.iso8601Parse(rotaShiftDate.startTime);

              startsAtOffset = (mStartsAt - mStartTime) / 1000 / 60;
              endsAtOffset = (mEndsAt - mStartTime) / 1000 / 60;
            }
            return new OwedHourModel({
              id: owedHour.get('id'),
              date: owedHour.get('date'),
              hasDate: owedHour.get('hasDate'),
              editable: owedHour.get('editable'),
              note: owedHour.get('note'),
              payslipDate: owedHour.get('payslipDate'),
              createdAt: owedHour.get('createdAt'),
              createdBy: owedHour.get('createdBy'),
              duration: new DurationModel({
                hours: duration.hours(),
                minutes: duration.minutes(),
              }),
              times: new TimesModel({
                startsAtOffset,
                endsAtOffset,
                startsAt: owedHour.get('startsAt'),
                endsAt: owedHour.get('endsAt'),
              }),
              frozen: owedHour.get('frozen'),
            });
          })
          .sortBy(owedHour => oFetch(owedHour, 'date'))
          .sortBy(owedHour => oFetch(owedHour, 'times.startsAt')),
      }),
    );
  }, Immutable.List());
  return result.sortBy(
    owedWeek => safeMoment.uiDateParse(oFetch(owedWeek, 'week.startDate')),
    (a, b) => {
      return a < b;
    },
  );
});
