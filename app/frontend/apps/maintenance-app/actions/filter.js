import constants from '../constants';

export function setFilterParams(filterParams) {
  return {
    type: constants.SET_FILTER_PARAMS,
    filterParams
  };
}
