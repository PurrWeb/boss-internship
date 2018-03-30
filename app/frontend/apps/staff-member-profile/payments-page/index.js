import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store';
import { combineReducers } from 'redux-immutable';
import { globalReducer } from './reducers';
import { initialPageLoad } from './actions';
import { PaymentsPageUI } from './components/payments-page-ui';
import oFetch from 'o-fetch';

const store = configureStore(combineReducers({ global: globalReducer }));

console.log(PaymentsPageUI);

class StaffMemberProfilePaymentsApp extends React.Component {
  componentWillMount() {
    store.dispatch(initialPageLoad({}));
  }

  render() {
    return <Provider store={store}>
      <PaymentsPageUI />
    </Provider>;
  }
}

export default StaffMemberProfilePaymentsApp;
