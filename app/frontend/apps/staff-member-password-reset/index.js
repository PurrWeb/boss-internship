import React from 'react';
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
    return (
      <Provider store={this.store}>
        <StaffMemberPasswordReset verificationToken={this.props.verificationToken} />
      </Provider>
    )
  }
}

export default StaffMemberPasswordResetApp
