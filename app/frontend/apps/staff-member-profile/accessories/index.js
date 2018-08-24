import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';
import { initialProfileLoad } from '../profile-wrapper/actions';
import { loadInitialState } from './redux/actions';
import { combineReducers } from 'redux-immutable';

import AccessoriesContainer from './containers/accessories-container';
import accessoriesReducer from './redux/reducers';
import profileReducer from '../profile-wrapper/reducers';

class StaffMemberAccessoriesApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(
      combineReducers({
        accessoriesPage: accessoriesReducer,
        profile: profileReducer,
      }),
    );
    this.store.dispatch(initialProfileLoad({ ...this.props }));
    this.store.dispatch(
      loadInitialState({
        ...this.props
      }),
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <AccessoriesContainer />
      </Provider>
    );
  }
}

export default StaffMemberAccessoriesApp;
