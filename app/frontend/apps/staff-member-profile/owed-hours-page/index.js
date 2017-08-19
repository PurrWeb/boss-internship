import React from 'react';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';

import configureStore from '../store';
import {initialLoad} from './actions';
import {initialProfileLoad} from '../profile-wrapper/actions';
import profileReducer from '../profile-wrapper/reducers';

import OwedHours from './containers/owed-hours';
import owedHoursReducers from './reducers';

const store = configureStore(combineReducers({
  profile: profileReducer,
  owedHours: owedHoursReducers, 
  form: formReducer,
}));

class StaffMemberOwedHoursApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialProfileLoad({...props}));
    store.dispatch(initialLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <OwedHours />
    </Provider>
  }
}

export default StaffMemberOwedHoursApp;
