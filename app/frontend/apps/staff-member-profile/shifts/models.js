
import Immutable from 'immutable';

export const HoursAcceptancePeriod = Immutable.Record({
  id: undefined,
  date: undefined,
  reasonNote: undefined,
  startsAt: undefined,
  endsAt: undefined,
  formattedFromTo: undefined,
  acceptedBy: undefined,
  acceptedAt: undefined,
  breaks: Immutable.List(),
});

export const HoursAcceptanceBreak = Immutable.Record({
  id: undefined,
  startsAt: undefined,
  endsAt: undefined,
});

export const RotaShift = Immutable.Record({
  id: undefined,
  date: undefined,
  startsAt: undefined,
  endsAt: undefined,
  formattedFromTo: undefined,
});

export const VenueShifts = Immutable.Record({
  hoursAcceptancePeriods: Immutable.List(),
  rotaShifts: Immutable.List(),
  venueName: undefined,
});