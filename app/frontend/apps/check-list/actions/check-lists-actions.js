import {
  SUBMIT_CHECKLIST,
  ANSWER_CHANGE,
  ANSWER_CHANGE_VALIDATION,
  REMVOE_SUBMITED_CHECKLIST,
  ADD_NEW_ITEM,
  UPDATE_NEW_ITEM,
  REMOVE_NEW_ITEM,
  CANCEL_ADD_NEW,
  EDIT_SINGLE_CHECKLIST,
  CANCEL_EDIT_SINGLE_CHECKLIST,
  UPDATE_EDITING_ITEM,
  REMOVE_EDITING_ITEM,
  ADD_EDITING_ITEM,
  UPDATE_EDITED_IN_LIST,
  DELETE_CHECKLIST,
  ADD_CHECKLIST,
  SUBMIT_CHECKLIST_ANSWER_CHANGE,
  SUBMIT_CHECKLIST_NOTE_CHANGE,
  SUBMIT_VALIDATE_CHECK_LIST,
  SET_SUBMIT_FAILED,
  CLEAR_SUBMITTED_CHECKLIST,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  TOGGLE_CHECKLIST,
  UPDATE_NEW_CHECKLIST_NAME,
  TOGGLE_NEW_CHECKLIST,
  RAISE_ERRORS,
} from '../constants/action-names';
import { reset } from 'redux-form/immutable';
import {
   CHECKLIST_ADDED,
   CHECKLIST_SUBMITTED,
   CHECKLIST_UPDATED,
   SUBMITTING_FAILED,
   NOTIFICATION_SUCCESS,
   NOTIFICATION_WARNING,
   NOTIFICATION_ERROR,
   NOTIFICATION_CLASSES,
   CHECKLIST_DELETED,
} from '../constants/notifications';

import {toggleEditMode} from './toggle-edit-mode';

import { fromJS, Map, List } from 'immutable';
import _ from 'lodash';
import axios from 'axios';
import { actions } from 'react-redux-form';

export const onToggleOpen = (id) => {
  return {
    type: TOGGLE_CHECKLIST,
    payload: {id}
  }
}

export const raiseValidationError = ({errors, checklistId}) => {
  return {
    type: RAISE_ERRORS,
    payload: {errors, checklistId},
  }
}

export const onToggleNewChecklist = (index) => {
  return {
    type: TOGGLE_NEW_CHECKLIST,
  }
}

export const showNotification = ({status, message}) => (dispatch, getState) => {
  const clear = setTimeout(() => {
    dispatch({
      type: HIDE_NOTIFICATION,
    });
  }, 5000);

  dispatch({
    type: SHOW_NOTIFICATION,
    payload: {status, message, clear},
  });
}

export const onNotificationClose = () => (dispatch, getState) => {
  const clear = getState().getIn(['notification', 'clear']);
  if (clear) { clearTimeout(clear); }

  dispatch({
    type: HIDE_NOTIFICATION,
  })
}

export const onNoteChange = (checklistId, answerId, value) => (dispatch, getState) => {
  dispatch({
    type: SUBMIT_CHECKLIST_NOTE_CHANGE,
    payload: {checklistId, answerId, value}
  });
}

export const onAnswerChange = (checklistId, answerId, value) => (dispatch, getState) => {
  const checklistIndex = getState().getIn(['checklists', 'checklists'])
    .findIndex(item => item.get('id') === checklistId);
  
  dispatch({
    type: SUBMIT_CHECKLIST_ANSWER_CHANGE,
    payload: {checklistId, answerId, value}
  });
  
  const isValid = getState().getIn(['checklists', 'checklists', checklistIndex, 'items']).filter(item => {
    return !item.get('answer') && !item.get('note');
  }).size === 0;

  dispatch({
    type: SUBMIT_VALIDATE_CHECK_LIST,
    payload:{checklistId, isValid}
  })
};

export const submitChecklist = (checklistId) => (dispatch, getState) => {
  const checklistIndex = getState().getIn(['checklists', 'checklists'])
    .findIndex(item => item.get('id') === checklistId);
  

  const currentVenue = getState().getIn(['checklists', 'currentVenue']);
  const accessToken = getState().getIn(['checklists', 'accessToken']);
  const checklist = getState()
    .deleteIn(['checklists', 'checklists', checklistIndex, 'form'])
    .updateIn(['checklists', 'checklists', checklistIndex, 'items'], (items) => {
      return items.map((item) => {
        return item.get('answer')
          ? item.set('note', null)
          : item;
      });
    }).getIn(['checklists', 'checklists', checklistIndex]);

  axios.post('/api/v1/check_lists/submit', {
    check_list: checklist,
    venue_id: currentVenue.get('id'),
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: SET_SUBMIT_FAILED,
      payload: {checklistIndex, value: false}
    });
    dispatch({
      type: CLEAR_SUBMITTED_CHECKLIST,
      payload: {checklistIndex, checklistId}
    });
    dispatch(showNotification({
      status: NOTIFICATION_SUCCESS,
      message: CHECKLIST_SUBMITTED,
    }));
  }).catch((error) => {
    const errors = error.response.data;
    dispatch({
      type: SET_SUBMIT_FAILED,
      payload: {checklistIndex, value: true}
    });
    dispatch(showNotification({
      status: NOTIFICATION_ERROR,
      message: SUBMITTING_FAILED,
    }));
    dispatch(raiseValidationError({errors, checklistId}));
  })
};

export const answerChangeValidation = (checkListKey, checkListItemKey, answer) => {
  return {
    type: ANSWER_CHANGE_VALIDATION,
    payload: {checkListKey, checkListItemKey, answer}
  }
}

export const removeSubmitedChecklist = (checklistIndex) => {
  return {
    type: REMVOE_SUBMITED_CHECKLIST,
    payload: {checklistIndex}
  }
};

export const addNewItem = (item) => {
  return {
    type: ADD_NEW_ITEM,
    payload: item
  }
};

export const updateNewItem = (index, item) => {
  return {
    type: UPDATE_NEW_ITEM,
    payload: {item, index}
  }
};

export const removeNewItem = (index) => {
  return {
    type: REMOVE_NEW_ITEM,
    payload: index
  }
};

export const cancelAddNew = () => {
  return {
    type: CANCEL_ADD_NEW,
  }
};

export const editSingle = (checklist) => {
  return {
    type: EDIT_SINGLE_CHECKLIST,
    payload: checklist,
  }
};

export const cancelEditSingle = () => {
  return {
    type: CANCEL_EDIT_SINGLE_CHECKLIST,
  }
};

export const updateEditingItem = (index, item) => {
  return {
    type: UPDATE_EDITING_ITEM,
    payload: {index, item},
  }
};

export const removeEditingItem = (index) => {
  return {
    type: REMOVE_EDITING_ITEM,
    payload: index,
  }
};

export const addEditingItem = (item) => {
  return {
    type: ADD_EDITING_ITEM,
    payload: item,
  }
};

export const deleteChecklist = (checklist) => (dispatch, getState) => {
  const accessToken = getState().getIn(['checklists', 'accessToken']);
  const id = checklist.get('id');
  const currentVenue = getState().getIn(['checklists', 'currentVenue']);

  axios.delete(`/api/v1/check_lists/${id}`,
  {
    params: {
      venue_id: currentVenue.get('id'),
    },
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: DELETE_CHECKLIST,
      payload: id,
    });
    dispatch(showNotification({
      status: NOTIFICATION_SUCCESS,
      message: CHECKLIST_DELETED,
    }));
  })
}

const addToList = (checklist) => {
  return {
    type: ADD_CHECKLIST,
    payload: checklist,
  }
}

export const updateNewChecklistName = (name) => {
  return {
    type: UPDATE_NEW_CHECKLIST_NAME,
    payload: {name},
  }
}

export const submitAddNew = (values) => (dispatch, getState) => {
  const accessToken = getState().getIn(['checklists', 'accessToken']);
  const currentVenue = getState().getIn(['checklists', 'currentVenue']);
  
  return axios.post('/api/v1/check_lists', {
    check_list: values,
    venue_id: currentVenue.get('id'),
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    const checklist = resp.data.check_list;
    dispatch(addToList(checklist));
    dispatch(cancelAddNew());
    dispatch(reset('checklist-add-new'));
    dispatch(toggleEditMode());
    dispatch(showNotification({
      status: NOTIFICATION_SUCCESS,
      message: CHECKLIST_ADDED,
    }));
  })
};

const updateEditedInList = (editingChecklist) => {
  return {
    type: UPDATE_EDITED_IN_LIST,
    payload: editingChecklist,
  }
}

export const submitEdited = (values) => (dispatch, getState) => {
  const accessToken = getState().getIn(['checklists', 'accessToken']);
  const currentVenue = getState().getIn(['checklists', 'currentVenue']);
  return axios.put(`/api/v1/check_lists/${values.id}`, {
    check_list: values,
    venue_id: currentVenue.get('id'),
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch(updateEditedInList(resp.data.check_list));
    dispatch(cancelEditSingle());
    dispatch(showNotification({
      status: NOTIFICATION_SUCCESS,
      message: CHECKLIST_UPDATED,
    }));
  });
};
