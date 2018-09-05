import React from 'react';
import { Provider } from 'react-redux';
import oFetch from 'o-fetch';

import configureStore from '~/apps/store';
import reducers from './redux/reducers';
import {loadInitialState} from './redux/actions';
import AccessoriesPageContainer from './containers/accessories-page-container';

class AccessoriesApp extends React.Component {

  componentWillMount() {
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialState({...this.props}));
    require('./styles.css');
  }

  render() {
    return(
      <Provider store={this.store}>
        <AccessoriesPageContainer permissions={oFetch(this.props, 'permissions')} />
      </Provider>
    )
  }
}

export default AccessoriesApp;
