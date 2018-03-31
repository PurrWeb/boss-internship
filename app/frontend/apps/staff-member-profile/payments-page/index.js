import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import { combineReducers } from 'redux-immutable';
import { globalReducer } from './reducers';
import { initialPageLoad } from './actions';
import { PaymentsPageUI } from './components/payments-page-ui';
import {initialProfileLoad} from '../profile-wrapper/actions';
import profileReducer from '../profile-wrapper/reducers';
import oFetch from 'o-fetch';

const store = configureStore(
  combineReducers({
    global: globalReducer,
    profile: profileReducer
  })
);

class StaffMemberProfilePaymentsApp extends React.Component {
  componentWillMount() {
    store.dispatch(initialProfileLoad({...this.props}));
    store.dispatch(initialPageLoad({...this.props}));
  }

  render() {
    return <Provider store={store}>
      <PaymentsPageUI />
    </Provider>;
  }
}

export default StaffMemberProfilePaymentsApp;
