import React from 'react';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import { initialLoad } from './redux/actions';
import { combineReducers } from 'redux-immutable';

import Shifts from './containers/shifts';

import profileReducer from '../profile-wrapper/reducers';
import shifts from './redux/reducers/shifts';
import venues from './redux/reducers/venues';

import fixtures from './fixtures';

class StaffMemberShiftsApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(combineReducers({
      venues,
      shifts,
      profile: profileReducer,
      form: formReducer,
    }));
    this.store.dispatch(initialProfileLoad({...this.props}));
    this.store.dispatch(initialLoad({...this.props, ...fixtures}));
  }

  render() {
    return <Provider store={this.store}>
      <Shifts />
    </Provider>
  }
}

export default StaffMemberShiftsApp;
