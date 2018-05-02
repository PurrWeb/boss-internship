import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { BossFormInput } from '~/components/boss-form';
import { combineReducers } from 'redux-immutable';
import { connect } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import MapEmbeded from './map-embeded';

class AddVenueForm extends Component {
  renderError(error) {
    return (
      <div className="boss-modal-window__alert">
        <div className="boss-alert boss-alert_role_area boss-alert_context_above">
          <p className="boss-alert__text">{error}</p>
        </div>
      </div>
    );
  }

  render() {
    const { error, buttonText } = this.props;
    return (
      <div>
        {error && this.renderError(error)}
        <div className="boss-modal-window__form">
          <form className="boss-form" onSubmit={this.props.handleSubmit}>
            <Field name="name" label="Name" required component={BossFormInput} />
            <Field name="address" label="Address" required component={BossFormInput} />
            <MapEmbeded query={this.props.address} />
            <div className="boss-form__field boss-form__field_justify_center">
              <button disabled={this.props.submitting} className="boss-button boss-form__submit" type="submit">
                {buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const onSubmit = (values, dispatch, props) => {
  return props.onFormSubmit(values, dispatch).catch(resp => {
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

const selector = formValueSelector('add-venue-form');

export default reduxForm({ form: 'add-venue-form', onSubmit, fields: ['id'] })(
  connect(state => {
    const address = selector(state, 'address');
    return {
      address,
    };
  })(AddVenueForm),
);
