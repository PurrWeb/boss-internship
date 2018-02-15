import URLSearchParams from 'url-search-params';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

export function filterQueryString(filterValues) {
  const queryString = new URLSearchParams(window.location.search);
  queryString.delete('venue_ids[]');
  queryString.delete('priorities[]');
  queryString.delete('status');
  queryString.delete('start_date');
  queryString.delete('end_date');
  queryString.delete('limit');
  const {
    venues,
    priorities,
    status,
    startDate,
    endDate,
    limit,
  } = filterValues;

  venues.forEach(venueId => {
    queryString.append('venue_ids[]', venueId);
  });
  priorities.forEach(priority => {
    queryString.append('priorities[]', priority);
  });
  queryString.set('status', status);
  if (limit) {
    queryString.set('limit', limit);
  }
  if (startDate && endDate) {
    queryString.set(
      'start_date',
      safeMoment.iso8601Parse(startDate).format(utils.commonDateFormat),
    );
    queryString.set(
      'end_date',
      safeMoment.iso8601Parse(endDate).format(utils.commonDateFormat),
    );
  }

  window.history.pushState(
    null,
    null,
    `ops-diaries${queryString.toString() === '' ? '' : `?${queryString}`}`,
  );

  return queryString.toString();
}

export function getInitialFilterData() {
  const querySearch = new URLSearchParams(window.location.search);
  const venues = querySearch
    .getAll('venue_ids[]')
    .map(venue => parseInt(venue));
  const priorities = querySearch.getAll('priorities[]');
  const status = querySearch.get('status');
  const startDate = querySearch.get('start_date');
  const endDate = querySearch.get('end_date');
  const limit = querySearch.get('limit');
  const dates = {
    startDate: null,
    endDate: null,
  };

  if (startDate && endDate) {
    dates.startDate = safeMoment.uiDateParse(startDate);
    dates.endDate = safeMoment.uiDateParse(endDate);
  }

  return {
    venues,
    priorities,
    status,
    limit,
    ...dates,
  };
}
