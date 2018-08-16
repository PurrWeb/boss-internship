import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import oFetch from 'o-fetch';

import EditFreeItemsForm from './edit-free-items-form';

class EditFreeItems extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch(resp => {
      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
      return resp;
    });
  };

  render() {
    const initialValues = {
      accessoryId: oFetch(this.props, 'accessory.id'),
      freeItemsCount: oFetch(this.props, 'accessory.freeItems'),
    };
    return (
      <EditFreeItemsForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        buttonText="Update"
        onOpenHistory={() => this.props.onOpenHistory(oFetch(this.props, 'accessory'))}
      />
    );
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(EditFreeItems);
