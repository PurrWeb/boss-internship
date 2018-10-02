import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import InviteUserForm from './invite-user-form';

class InviteUser extends React.Component {
  render() {
    const initialValues = {
      firstName: null,
      surname: null,
      role: null,
      venueIds: null,
      email: null,
    };
    return <InviteUserForm onSubmit={this.props.onSubmit} initialValues={initialValues} venues={this.props.venues} />;
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(InviteUser);
