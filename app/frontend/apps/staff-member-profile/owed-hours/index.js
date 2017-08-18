import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../store';
import {initialLoad} from './actions';

import OwedHours from './containers/owed-hours';
import owedHoursReducers from './reducers';

const store = configureStore(owedHoursReducers);

class StaffMemberOwedHoursApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <OwedHours />
    </Provider>
  }
}

export default StaffMemberOwedHoursApp;
