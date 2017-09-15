import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import ProfilePage from './containers/profile-page';
import profileReducer from '../profile-wrapper/reducers';

const store = configureStore(combineReducers({
  profile: profileReducer,
  form: formReducer,
}));

class StaffMemberProfileDetailsApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialProfileLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <ProfilePage/>
    </Provider>
  }
}

export default StaffMemberProfileDetailsApp;
