import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './store';
import OpsDiaries from './containers/ops-diaries';

class OpsDiaryApp extends Component {
  componentWillMount() {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;

    this.store = configureStore();
  }

  render() {
    return (
      <Provider store={this.store}>
        <OpsDiaries />
      </Provider>
    );
  }
}

export default OpsDiaryApp;
