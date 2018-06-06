import React from 'react';
import { Provider } from 'react-redux';
import reducers from './reducers';
import oFetch from 'o-fetch';
import PaymentUploadAppUI from './containers/payment-upload-app-ui';
import { initializeState } from './actions';
import configureStore from '~/apps/store';

const store = configureStore(reducers);

class PaymentUploadApp extends React.Component {
  componentWillMount() {
    store.dispatch(initializeState({
      accessToken: oFetch(this.props, 'accessToken')
    }));
  }

  render() {
    return <Provider store={store}>
      <PaymentUploadAppUI />
    </Provider>;
  }
}

export default PaymentUploadApp;
