import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import {initialProfileDetailsLoad} from './actions';
import ProfilePage from './containers/profile-page';
import profileReducer from '../profile-wrapper/reducers';
import staffMemberReducer from './reducers';

const store = configureStore(combineReducers({
  profile: profileReducer,
  profileDetails: staffMemberReducer,
  form: formReducer,
}));

class StaffMemberProfileDetailsApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialProfileLoad({...props}));
    store.dispatch(initialProfileDetailsLoad(props.staffMember))
  }

  render() {
    return <Provider store={store}>
      <ProfilePage/>
    </Provider>
  }
}

export default StaffMemberProfileDetailsApp;
