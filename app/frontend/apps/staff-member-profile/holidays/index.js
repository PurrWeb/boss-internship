import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../store';
import {initialLoad} from './actions';

import Holidays from './containers/holidays';
import holidaysReducer from './reducers';

const store = configureStore(holidaysReducer);

class StaffMemberHolidaysApp extends React.Component {
  constructor(props) {
    super(props);
    store.dispatch(initialLoad({...props}));
  }

  render() {
    return <Provider store={store}>
      <Holidays />
    </Provider>
  }
}

export default StaffMemberHolidaysApp;
