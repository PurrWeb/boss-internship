import React from 'react';
import { bindActionCreators } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import RedeemVouchers from './containers/redeem-vouchers';

import configureStore from '~/apps/store';
import reducers from './reducers';
import {initialLoad} from './actions';

class VouchersRedeemApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(initialLoad({...this.props}));
  }
  
  render() {
    return (
      <Provider store={this.store}>
        <RedeemVouchers />
      </Provider>
    )
  }
}

export default VouchersRedeemApp
