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

class StaffMemberHolidaysApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(combineReducers({
      holidays: holidaysReducer,
      profile: profileReducer,
      form: formReducer,
    }));
    this.store.dispatch(initialProfileLoad({...this.props}));
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return <Provider store={this.store}>
      <Holidays />
    </Provider>
  }
}

export default StaffMemberHolidaysApp;
