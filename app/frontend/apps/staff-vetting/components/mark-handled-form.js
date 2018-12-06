import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { BossFormTextarea } from '~/components/boss-form';

class MarkHandledForm extends Component {
  onSubmit = values => {
    const onSubmit = oFetch(this.props, 'onSubmit');
    const jsValues = values.toJS();
    return onSubmit(jsValues).catch(err => {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
      throw err;
    });
  };

  render() {
    const [handleSubmit, submitting] = oFetch(this.props, 'handleSubmit', 'submitting');
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="boss-modal-window__message-block">
          <div className="boss-modal-window__message-group">
            <p className="boss-modal-window__message-note">
              Please provide a description of the disciplinary action that has been taken below
            </p>
          </div>
          <div className="boss-modal-window__message-group">
            <div className="boss-form">
              <Field name="note" label="Note" component={BossFormTextarea} />
            </div>
          </div>
        </div>
        <div className="boss-modal-window__actions">
          <button
            onClick={this.props.onClose}
            type="button"
            className="boss-button boss-button_role_inactive boss-modal-window__button"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            type="submit"
            className="boss-button boss-button_role_alert boss-modal-window__button"
          >
            Mark Handled
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({ form: 'accessory-form' })(MarkHandledForm);
