import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import ProfilePage from './containers/profile-page';
import profileReducer from '../profile-wrapper/reducers';

class StaffMemberProfileDetailsApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(combineReducers({
      profile: profileReducer,
      form: formReducer,
    }));
    this.store.dispatch(initialProfileLoad({...this.props}));
  }

  render() {
    return <Provider store={this.store}>
      <ProfilePage/>
    </Provider>
  }
}

export default StaffMemberProfileDetailsApp;
