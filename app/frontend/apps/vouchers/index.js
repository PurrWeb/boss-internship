import React from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import Vouchers from './containers/vouchers';
import configureStore from './store';
import setInitialData from './actions/initial-load';

const store = configureStore();

class VouchersApp extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch(setInitialData({...props}));
  }
  
  render() {
    return (
      <Provider store={store}>
        <Vouchers />
      </Provider>
    )
  }
}

export default VouchersApp
