import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../store';
import {initialLoad} from './actions';

import ProfileDetailsPage from './containers/profile-details-page';
import profileDetailsReducer from './reducers';

const store = configureStore(profileDetailsReducer);

class StaffMemberProfileDetailsApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <ProfileDetailsPage />
    </Provider>
  }
}

export default StaffMemberProfileDetailsApp;
