import React, { Component } from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { modalRedux } from '~/components/modals';

import NoteForm from './note-form';

class AddNote extends Component {
  render() {
    const initialValues = {
      title: '',
      text: '',
      venueId: null,
      priority: null,
    };
    return (
      <NoteForm
        initialValues={initialValues}
        {...this.props}
        buttonName="Create"
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(AddNote);
