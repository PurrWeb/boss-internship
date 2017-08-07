import { createSelector } from 'reselect';

const selectGlobal = (state) => state;

const makeSelectCurrentVenue = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentVenue')
);

const makeSelectVenues = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('venues')
);

const makeSelectStartDate = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['filter', 'range', 'startDate'])
);

const makeSelectEndDate = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['filter', 'range', 'endDate'])
);

const makeSelectIsDetailsOpen = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('isDetailsOpen')
);

const makeSelectIsFilterOpen = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('isFilterOpen')
);

const makeSelectDetailedSubmission = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('detailedSubmission')
);

const makeSelectSubmissions = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('submissions')
);

const makeSelectPageCount = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['pagination', 'pageCount']),
);

const makeSelectCurrentPage = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['pagination', 'currentPage']),
);

const makeSelectCreatedBy = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['filter', 'createdBy']),
);

const makeSelectStatus = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['filter', 'status']),
);

export {
  makeSelectCurrentVenue,
  makeSelectVenues,
  makeSelectStartDate,
  makeSelectEndDate,
  makeSelectIsDetailsOpen,
  makeSelectIsFilterOpen,
  makeSelectDetailedSubmission,
  makeSelectSubmissions,
  makeSelectPageCount,
  makeSelectCurrentPage,
  makeSelectCreatedBy,
  makeSelectStatus,
}
