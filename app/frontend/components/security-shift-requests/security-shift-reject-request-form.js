import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  SubmissionError,
  formValueSelector,
} from 'redux-form/immutable';
import oFetch from 'o-fetch';
import RotaDate from '~/lib/rota-date';
import { BossFormCheckbox } from '~/components/boss-form';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormTimeSelect from '~/components/boss-form/boss-form-time-select-simple';
import BossFormTextArea from '~/components/boss-form/boss-form-textarea';

const onSubmit = (values, dispatch, props) => {
  const jsValues = values.toJS();

  return props
    .onFormSubmit(jsValues, dispatch)
    .catch(resp => {
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

const renderBaseError = errors => {
  return (
    <div className="boss-modal-window__alert" style={{ width: '100%' }}>
      <div className="boss-alert boss-alert_role_area boss-alert_context_above">
        {errors.map((error, index) => (
          <p key={index.toString()} className="boss-alert__text">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};

class SecurityShiftRejectRequestForm extends React.Component {
  render() {
    const { error, rejectReason } = this.props;
    return (
      <div className="boss-modal-window__form">
        <form onSubmit={this.props.handleSubmit} className="boss-form">
          {error && renderBaseError(error)}
          <Field
            name="rejectReason"
            required
            label="Reason for rejecting"
            component={BossFormTextArea}
          />
          <div className="boss-form__field">
            <div className="boss-form__field">
              <button
                disabled={this.props.submitting || !rejectReason}
                className={`boss-button boss-form__submit ${
                  this.props.buttonClass
                }`}
              >
                {this.props.buttonText}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

SecurityShiftRejectRequestForm.propTypes = {
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  onFormSubmit: PropTypes.func.isRequired,
};

SecurityShiftRejectRequestForm.defaultProps = {
  buttonClass: 'boss-button_role_cancel',
  buttonText: 'Reject',
};

const withReduxFormSecurityShiftRejectRequest = reduxForm({
  fields: ['id', 'venueId'],
  onSubmit: onSubmit,
  form: 'security-shift-reject-request-form',
})(SecurityShiftRejectRequestForm);

const selector = formValueSelector('security-shift-reject-request-form');

export default connect(state => {
  return {
    rejectReason: selector(state, 'rejectReason'),
  };
})(withReduxFormSecurityShiftRejectRequest);
