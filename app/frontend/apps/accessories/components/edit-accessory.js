import React from 'react';
import { combineReducers } from 'redux-immutable';
import {reducer as formReducer, SubmissionError} from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { modalRedux } from '~/components/modals'

import AccessoryForm from './accessory-form';

class EditAccessory extends React.Component {
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

  mapSizes(sizes) {
    if (!sizes) {return []}

    return sizes.split(',').map(size => {
      return {
        id: Math.floor(Math.random() * 1000000000) + 1,
        name: size
      };
    });
  }

  render() {
    const {
      accessory,
    } = this.props;

    const initialValues = {
      id: oFetch(accessory, 'id'),
      name: oFetch(accessory, 'name'),
      priceCents: oFetch(accessory, 'priceCents') / 100,
      accessoryType: oFetch(accessory, 'accessoryType'),
      userRequestable: oFetch(accessory, 'userRequestable'),
      size: this.mapSizes(oFetch(accessory, 'size')),
    }

    return (
      <AccessoryForm
        onSubmit={this.handleSubmit}
        initialValues={initialValues}
        buttonText="Update"
        buttonClass="boss-button_role_confirm"
      />
    )
  }
}

export default modalRedux(combineReducers({form: formReducer}))(EditAccessory);
