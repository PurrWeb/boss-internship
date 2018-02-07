import React from 'react';
import { Provider } from 'react-redux';

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
        <AccessoriesPageContainer />
      </Provider>
    )
  }
}

export default AccessoriesApp;
