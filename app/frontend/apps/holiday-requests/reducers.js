import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

{
  INITIAL_LOAD
} from './constants';

const initialGlobalState = fromJS({
  accessToken: ''
});

const globalReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const payload = oFetch(action, 'payload');

    return state.
      set('accessToken', oFetch(payload, 'accessToken'));
  }
}, initialGlobalState);

export default combineReducers({
  global: globalReducer
})
