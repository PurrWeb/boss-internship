import {
  TOGGLE_EDIT_MODE,
  UPDATE_SUBMITTING_CHECKLISTS,
} from '../constants/action-names';

export const toggleEditMode = () => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_EDIT_MODE,
  });
  dispatch({
    type: UPDATE_SUBMITTING_CHECKLISTS,
  })
};
