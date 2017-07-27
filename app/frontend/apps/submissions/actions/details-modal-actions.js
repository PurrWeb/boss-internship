import {
  OPEN_DETAILS_MODAL,
  CLOSE_DETAILS_MODAL
} from '../constants/action-names';

export const openDetailsModal = (submission) => {
  return {
    type: OPEN_DETAILS_MODAL,
    payload: submission,
  };
}

export const closeDetailsModal = () => {
  return {
    type: CLOSE_DETAILS_MODAL,
  };
}
