import React, { Component } from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { modalRedux } from '~/components/modals';

import NoteEditForm from './note-edit-form';

class EditNote extends Component {
  render() {
    const { diary } = this.props;
    const initialValues = {
      id: oFetch(diary, 'id'),
      title: oFetch(diary, 'title'),
      text: oFetch(diary, 'text'),
      priority: oFetch(diary, 'priority'),
    };
    return (
      <NoteEditForm
        initialValues={initialValues}
        {...this.props}
        buttonName="Update"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(EditNote);
