import safeMoment from '~/lib/safe-moment';

export const getDiffFromRotaDayStartInMinutes = timeISOString =>
  safeMoment.iso8601Parse(timeISOString).diff(
    safeMoment
      .iso8601Parse(timeISOString)
      .hours(8)
      .minutes(0)
      .seconds(0)
      .milliseconds(0),
    'minutes',
  );