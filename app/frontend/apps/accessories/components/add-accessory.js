import React from 'react';
import { combineReducers } from 'redux-immutable';
import {reducer as formReducer, SubmissionError} from 'redux-form/immutable';
import { modalRedux } from '~/components/modals'

import AccessoryForm from './accessory-form';

class AddAccessory extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch((resp) => {
      console.log(resp);
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
      name: null,
      priceCents: null,
      accessoryType: null,
      userRequestable: false,
      size: [],
    }

    return (
      <AccessoryForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        buttonText="Add Accessory"
        buttonClass="boss-button_role_add"
      />
    )
  }
}

export default modalRedux(combineReducers({form: formReducer}))(AddAccessory);
