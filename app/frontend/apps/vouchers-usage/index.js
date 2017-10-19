import React from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import VoucherUsages from './containers/voucher-usages';
import configureStore from '~/apps/store';
import reducers from './reducers';
import {initialLoad} from './actions';

class VouchersUsageApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }
  
  render() {
    return (
      <Provider store={this.store}>
        <VoucherUsages />
      </Provider>
    )
  }
}

export default VouchersUsageApp
