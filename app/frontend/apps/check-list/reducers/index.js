import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import { reducer as formReducer } from 'redux-form/immutable';

import {
  INITIAL,
  TOGGLE_EDIT_MODE,
  FILL_CHECKLISTS_DATA,
  ANSWER_CHANGE,
  ANSWER_CHANGE_VALIDATION,
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
  SUBMIT_VALIDATE_CHECK_LIST,
  SET_SUBMIT_FAILED,
  SUBMIT_CHECKLIST_NOTE_CHANGE,
  CLEAR_SUBMITTED_CHECKLIST,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  UPDATE_SUBMITTING_CHECKLISTS,
  TOGGLE_CHECKLIST,
  TOGGLE_NEW_CHECKLIST,
  UPDATE_NEW_CHECKLIST_NAME,
  RAISE_ERRORS,
} from '../constants/action-names';

const initialState = fromJS({
  isEditMode: false,
  checklists: [],
  currentVenue: null,
  venues: [],
  newCheckList: {
    name: '',
    venue_id: null,
    items: [],
    isOpen: false,
  },
  editingChecklist: false,
  notification: null,
  errors: {},
});

const checklistReducer = handleActions({
  [INITIAL]: (state, action) => {
    const checklists = fromJS(action.payload.checklists).map(item => {
      return item
        .set('isOpen', false)
        .setIn(['form', 'submitted'], false)
        .setIn(['form', 'submittedFailed'], false)
        .setIn(['form', 'valid'], false)
    })
    return state
      .set('checklists', checklists)
      .set('currentVenue', fromJS(action.payload.currentVenue))
      .set('accessToken', fromJS(action.payload.accessToken))
      .set('venues', fromJS(action.payload.venues))
  },
  [FILL_CHECKLISTS_DATA]: (state, action) => {
    const checklists = fromJS(action.payload.checklists).map(item => {
      return item
        .set('isOpen', false)
        .setIn(['form', 'submitted'], false)
        .setIn(['form', 'submittedFailed'], false)
        .setIn(['form', 'valid'], false)
    });

    return state
      .set('checklists', checklists)
      .set('currentVenue', fromJS(action.payload.current_venue))
      .set('isEditMode', false)
      .set('editingChecklist', false)
  },
  [RAISE_ERRORS]: (state, action) => {
    const { errors:{errors}, checklistId } = action.payload;
    if (!errors) {
      return state;
    } else {
      return state.setIn(['errors', `checklist.${checklistId}`], fromJS(errors));
    }
  },
  [TOGGLE_CHECKLIST]: (state, action) => {
    const { id } = action.payload;
    const index = state.get('checklists')
      .findIndex(item => item.get('id') === id);

    return state
      .updateIn(['checklists', index, 'isOpen'], isOpen => !isOpen)
  },
  [TOGGLE_NEW_CHECKLIST]: (state, action) => {
    return state
      .updateIn(['newCheckList', 'isOpen'], isOpen => !isOpen)
  },
  [UPDATE_NEW_CHECKLIST_NAME]: (state, action) => {
    const { name } = action.payload;
    return state
      .setIn(['newCheckList', 'name'], name)
  },
  [SHOW_NOTIFICATION]: (state, action) => {
    return state.set('notification', fromJS({...action.payload}));
  },
  [HIDE_NOTIFICATION]: (state, action) => {
    const clear = state.getIn(['notification', 'clear']);
    if (clear) { clearTimeout(clear); }
    return state.set('notification', null);
  },
  [SUBMIT_CHECKLIST_NOTE_CHANGE]: (state, action) => {
    const {checklistId, answerId, value} = action.payload;
    const checklistIndex = state.get('checklists').findIndex(item => item.get('id') === checklistId);
    const answerIndex = state.getIn(['checklists', checklistIndex, 'items']).findIndex(item => item.get('id') === answerId);

    return state
      .setIn(['checklists', checklistIndex, 'items', answerIndex, 'note'], value)
  },
  [SUBMIT_CHECKLIST_ANSWER_CHANGE]: (state, action) => {
    const {checklistId, answerId, value} = action.payload;
    const checklistIndex = state.get('checklists').findIndex(item => item.get('id') === checklistId);
    const answerIndex = state.getIn(['checklists', checklistIndex, 'items']).findIndex(item => item.get('id') === answerId);

    return state
      .setIn(['checklists', checklistIndex, 'items', answerIndex, 'answer'], value)
  },
  [SUBMIT_VALIDATE_CHECK_LIST]: (state, action) => {
    const {checklistId, isValid} = action.payload;
    const checklistIndex = state.get('checklists')
      .findIndex(item => item.get('id') === checklistId);
    return state
      .setIn(['checklists', checklistIndex, 'form', 'valid'], isValid);
  },
  [SET_SUBMIT_FAILED]: (state, action) => {
    const {checklistIndex, value} = action.payload;
    return state
      .setIn(['checklists', checklistIndex, 'form', 'submittedFailed'], value)
      .setIn(['checklists', checklistIndex, 'form', 'submitted'], true);
  },
  [CLEAR_SUBMITTED_CHECKLIST]: (state, action) => {
    const {checklistIndex, checklistId} = action.payload;
    return state
      .updateIn(['checklists', checklistIndex], (checklist) => {
        return checklist
          .setIn(['form', 'submitted'], false)
          .setIn(['form', 'submittedFailed'], false)
          .setIn(['form', 'valid'], false)
          .set('isOpen', false)
          .update('items', (items) => {
            return items.map(item => {
              return item
                .delete('answer')
                .delete('note')
            })
          })
      }).deleteIn(['errors', `checklist.${checklistId}`])
  },
  [TOGGLE_EDIT_MODE]: (state) => {
    const isEditMode = state.get('isEditMode');
    return state
      .set('isEditMode', !isEditMode);
  },
  [ADD_NEW_ITEM]: (state, action) => {
    return state
      .setIn(['newCheckList', 'items'], state.getIn(['newCheckList', 'items']).push(fromJS(action.payload)));
  },
  [UPDATE_NEW_ITEM]: (state, action) => {
    const {item, index} = action.payload;
    return state
      .setIn(['newCheckList', 'items', index], fromJS(item));
  },
  [REMOVE_NEW_ITEM]: (state, action) => {
    return state
      .setIn(['newCheckList', 'items'],
        state.getIn(['newCheckList', 'items']).filter((item, index) => index !== action.payload)
      )
  },
  [CANCEL_ADD_NEW]: (state, action) => {
    const index = action.payload;
    return state
      .set('newCheckList', fromJS({name: '', venue_id: null, items: List([]), isOpen: false}))
  },
  [EDIT_SINGLE_CHECKLIST]: (state, action) => {
    return state
      .set('editingChecklist', fromJS(action.payload));
  },
  [CANCEL_EDIT_SINGLE_CHECKLIST]: (state) => {
    return state
      .set('editingChecklist', false);
  },
  [ADD_EDITING_ITEM]: (state, action) => {
    const item = action.payload;
    return state
      .setIn(['editingChecklist', 'items'],
        state.getIn(['editingChecklist', 'items'])
          .push(fromJS(action.payload))
      );
  },
  [ADD_CHECKLIST]: (state, action) => {
    const checklist = fromJS(action.payload)
      .setIn(['form', 'submitted'], false)
      .setIn(['form', 'submittedFailed'], false)
      .setIn(['form', 'valid'], false)
      .set('isOpen', false);

    return state
      .update('checklists', arr => arr.push(checklist))
  },
  [UPDATE_EDITING_ITEM]: (state, action) => {
    const {item, index} = action.payload;
    return state
      .setIn(['editingChecklist', 'items', index], fromJS(item));
  },
  [REMOVE_EDITING_ITEM]: (state, action) => {
    return state
      .setIn(['editingChecklist', 'items'],
        state.getIn(['editingChecklist', 'items']).filter((item, index) => index !== action.payload)
      )
  },
  [UPDATE_EDITED_IN_LIST]: (state, action) => {
    const editedChecklist = fromJS(action.payload)
      .setIn(['form', 'submitted'], false)
      .setIn(['form', 'submittedFailed'], false)
      .setIn(['form', 'valid'], false)
      .set('isOpen', false);
    const id = editedChecklist.get('id');
    const index = state.get('checklists').findIndex(item => item.get("id") === id);

    return state
      .setIn(['checklists', index], editedChecklist)
  },
  [DELETE_CHECKLIST]: (state, action) => {
    const id = action.payload;

    return state
      .update('checklists',
      (checklists) => checklists.filter(
        (item) => item.get('id') !== id
      )
    )
  }
}, initialState);

export default combineReducers({
  checklists: checklistReducer,
  form: formReducer,
})
