import React from 'react';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import {initialLoad} from './actions';
import { combineReducers } from 'redux-immutable';

import Holidays from './containers/holidays';
import holidaysReducer from './reducers';
import profileReducer from '../profile-wrapper/reducers';

const reducers = {
  holidays: holidaysReducer,
  profile: profileReducer,
  form: formReducer,
}

const store = configureStore(combineReducers(reducers));

class StaffMemberHolidaysApp extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch(initialProfileLoad({...props}))
    store.dispatch(initialLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <Holidays />
    </Provider>
  }
}

export default StaffMemberHolidaysApp;
