import { createSelector } from 'reselect';

const selectGlobal = (state) => state;

const makeSelectIsVoucherModalOpen = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('isVoucherModalOpen')
)

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

const makeSelectVouchers = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('vouchers')
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
  makeSelectVouchers,
  makeSelectPageCount,
  makeSelectCurrentPage,
  makeSelectCreatedBy,
  makeSelectStatus,
  makeSelectIsVoucherModalOpen,
}
