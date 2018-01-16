import React from 'react';
import oFetch from 'o-fetch';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';

import StaffMemberPasswordReset from './staff-member-password-reset';

class StaffMemberPasswordResetApp extends React.Component {
  componentWillMount() {
    this.store = {};
    this.store = configureStore(combineReducers({
      form: formReducer
    }));
  }

  render() {
    const verificationToken = oFetch(this.props, 'verificationToken');
    const actionDescription = oFetch(this.props, 'actionDescription');
    const successPath = oFetch(this.props, 'successPath');
    const requestPath = oFetch(this.props, 'requestPath');

    return (
      <Provider store={this.store}>
        <StaffMemberPasswordReset verificationToken={verificationToken} actionDescription={actionDescription} successPath={successPath} requestPath={requestPath} />
      </Provider>
    )
  }
}

export default StaffMemberPasswordResetApp
