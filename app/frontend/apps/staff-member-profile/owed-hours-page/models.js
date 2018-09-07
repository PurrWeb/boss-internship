import Immutable from 'immutable';

export const WeekModel = Immutable.Record({
  startDate: undefined,
  endDate: undefined,
  totalHours: undefined,
});

export const TimesModel = Immutable.Record({
  startsAtOffset: undefined,
  endsAtOffset: undefined,
  startsAt: undefined,
  endsAt: undefined,
});

export const DurationModel = Immutable.Record({
  hours: undefined,
  minutes: undefined,
});

export const OwedHoursWeekModel = Immutable.Record({
  week: undefined,
  owedHours: undefined,
});

export const OwedHourModel = Immutable.Record({
  id: undefined,
  editable: undefined,
  hasDate: undefined,
  date: undefined,
  note: undefined,
  times: undefined,
  duration: undefined,
  payslipDate: undefined,
  createdAt: undefined,
  createdBy: undefined,
});
