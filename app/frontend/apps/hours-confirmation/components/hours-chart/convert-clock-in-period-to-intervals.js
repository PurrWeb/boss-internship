import _ from 'underscore';

export default function(denormalizedHoursPeriod) {
  var breaksOrderedByStartTime = _.sortBy(
    denormalizedHoursPeriod.breaks,
    'startsAt',
  );

  var lastTime = denormalizedHoursPeriod.startsAt;
  var intervals = [];

  breaksOrderedByStartTime.forEach(function(breakItem) {
    intervals.push({
      startsAt: lastTime,
      endsAt: breakItem.startsAt,
      type: 'hours',
    });
    if (breakItem.endsAt) {
      intervals.push({
        startsAt: breakItem.startsAt,
        endsAt: breakItem.endsAt,
        type: 'break',
      });
      lastTime = breakItem.endsAt;
    }
  });

  if (denormalizedHoursPeriod.endsAt) {
    intervals.push({
      startsAt: lastTime,
      endsAt: denormalizedHoursPeriod.endsAt,
      type: 'hours',
    });
  }

  return intervals;
}
