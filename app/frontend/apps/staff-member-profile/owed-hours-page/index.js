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

class StaffMemberOwedHoursApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(combineReducers({
      profile: profileReducer,
      owedHours: owedHoursReducers,
      form: formReducer,
    }));
    this.store.dispatch(initialProfileLoad({...this.props}));
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return <Provider store={this.store}>
      <OwedHours />
    </Provider>
  }
}

export default StaffMemberOwedHoursApp;
