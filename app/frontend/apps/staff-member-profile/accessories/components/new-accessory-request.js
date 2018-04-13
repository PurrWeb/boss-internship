import React from 'react';
import { combineReducers } from 'redux-immutable';
import {reducer as formReducer, SubmissionError} from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';

import * as constants from './constants';
import NewAccessoryRequestForm from './new-accessory-request-form';

class NewAccessoryRequest extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch((resp) => {
      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base
          }
        }
        throw new SubmissionError({...errors, ...base});
      }
      return resp;
    })
  }

  render() {
    const initialValues = {
      accessoryType: constants.MISC_TYPE,
      accessoryId: null,
      size: null,
    }

    return (
      <NewAccessoryRequestForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        allAccessories={this.props.accessories.toJS()}
        buttonText="Add Request"
        buttonClass="boss-button_role_add"
      />
    )
  }
}
export default modalRedux(combineReducers({form: formReducer}))(NewAccessoryRequest);
