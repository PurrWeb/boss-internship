import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import moment from 'moment';

import EnableProfileForm from './enable-profile-form';

class EnableProfile extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch(resp => {
      if (resp.response && resp.response.data) {
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
      }
      throw resp;
    });
  };

  render() {
    const initialValues = { startsAt: moment() };

    return <EnableProfileForm onSubmit={this.handleSubmit} initialValues={initialValues} />;
  }
}

export default modalRedux(combineReducers({ form: formReducer }))(EnableProfile);
