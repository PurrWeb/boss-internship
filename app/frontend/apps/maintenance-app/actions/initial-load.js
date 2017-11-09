import constants from '../constants';

export function setInitialData(initialData) {
  return {
    type: constants.INITIAL_LOAD,
    initialData
  };
}
