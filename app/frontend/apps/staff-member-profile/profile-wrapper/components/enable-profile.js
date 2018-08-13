import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import EnableProfileForm from './enable-profile-form';

class EnableProfile extends React.Component {
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
    const initialValues = { startsAt: null };

    return <EnableProfileForm onSubmit={this.handleSubmit} initialValues={initialValues} />;
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(EnableProfile);
