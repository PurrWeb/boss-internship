import React, { Component } from 'react';
import oFetch from 'o-fetch';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import MarkHandledForm from './mark-handled-form';

class MarkHandled extends Component {
  render() {
    const id = oFetch(this.props, 'id');
    const initialValues = {
      staffMemberId: id,
      note: null,
    };
    const [onSubmit, onClose] = oFetch(this.props, 'onSubmit', 'onClose');
    return <MarkHandledForm initialValues={initialValues} onSubmit={onSubmit} onClose={onClose} />;
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(MarkHandled);
