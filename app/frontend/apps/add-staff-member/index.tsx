import * as React from 'react';
import {Provider} from 'react-redux';

import store from '../../store/index';
import App from './components/common-page-content';
// tslint:disable-next-line:no-require-imports
require('../../../assets/stylesheets/new-style3/index.scss');

const Root = class extends React.Component <{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
};

export default Root;