import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import {
  INITIAL_LOAD,
  EDIT_MACHINE_SHOW,
  EDIT_MACHINE_HIDE,
  RESTORE_MACHINE_HIDE,
  RESTORE_MACHINE_SHOW,
  ADD_MACHINE,
  ADD_NEW_MACHINE_HIDE,
  ADD_NEW_MACHINE_SHOW,
  UPDATE_MACHINE,
} from './constants';

const initialState = fromJS({
  currentVenueId: null,
  accessToken: null,
  accessibleVenues: [],
  machinesCreators: [],
  machines: [],
  filter: "enabled",
  pagination: {
    currentPage: 1,
    size: null,
    perPage: null,
    pageCount: null,
  },
  editMachine: false,
  addingMachine: false,
});

const machinesIndexReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      accessToken,
      accessibleVenues,
      currentVenueId,
      machines,
      machinesCreators,
      filter,
      currentPage,
      size,
      perPage,
    } = action.payload;
    
    return state
      .set('accessToken', accessToken)
      .set('accessibleVenues', fromJS(accessibleVenues))
      .set('currentVenueId', currentVenueId)
      .set('machines', fromJS(machines))
      .set('machinesCreators', fromJS(machinesCreators))
      .set('filter', filter)
      .setIn(['pagination', 'currentPage'], parseInt(currentPage))
      .setIn(['pagination', 'size'], size)
      .setIn(['pagination', 'perPage'], perPage)
      .setIn(['pagination', 'pageCount'], Math.ceil(size / perPage))
  },
  [EDIT_MACHINE_HIDE]: (state) => {
    return state.set('editMachine', false)
  },
  [EDIT_MACHINE_SHOW]: (state, action) => {
    return state.set('editMachine', action.payload);
  },
  [RESTORE_MACHINE_HIDE]: (state) => {
    return state.set('restoreMachine', false)
  },
  [RESTORE_MACHINE_SHOW]: (state, action) => {
    return state.set('restoreMachine', action.payload);
  },
  [ADD_MACHINE]: (state, action) => {
    return state.update('machines', machines => machines.unshift(fromJS(action.payload)));
  },
  [ADD_NEW_MACHINE_SHOW]: (state, action) => {
    return state.set('addingMachine', true);
  },
  [ADD_NEW_MACHINE_HIDE]: (state, action) => {
    return state.set('addingMachine', false);
  },
  [UPDATE_MACHINE]: (state, action) => {
    const {
      id
    } = action.payload;
    const filter = state.get('filter');
    const machines = state.get('machines');
    const index = machines.findIndex(machine => machine.get('id') === id);
    return state.set('machines', machines.update(index, () => fromJS(action.payload)));
  }
}, initialState);

export default combineReducers({
  page: machinesIndexReducer,
  form: formReducer,
})

