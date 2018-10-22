import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import BossFormCalendar from '~/components/boss-form/boss-form-calendar';
import BossFormTimeSelect from '~/components/boss-form/boss-form-time-select-simple';
import BossFormTextArea from '~/components/boss-form/boss-form-textarea';
import VenueSelectFormField from './venue-select-form-field';

const onSubmit = (values, dispatch, props) => {
  const jsValues = values.toJS();
  const date = oFetch(jsValues, 'date');
  const mDate = date.hours(8).startOf('hour');

  const endsAt = mDate
    .clone()
    .add(oFetch(jsValues, 'endsAt'), 'minutes')
    .toDate();

  const startsAt = mDate
    .clone()
    .add(oFetch(jsValues, 'startsAt'), 'minutes')
    .toDate();

  return props.onFormSubmit({ ...jsValues, startsAt, endsAt }, dispatch).catch(resp => {
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

class SecurityShiftRequestForm extends React.Component {
  render() {
    const { error, date, startsAt, endsAt, venueId, venues } = this.props;
    return (
      <form onSubmit={this.props.handleSubmit} className="boss-modal-window__form boss-form">
        {error && renderBaseError(error)}
        <div className="boss-form__row">
          <div className="boss-form__group boss-form__group_layout_max">
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_layout_half">
                <Field
                  name="venueId"
                  label="Venue"
                  clearable={false}
                  required
                  venues={venues}
                  component={VenueSelectFormField}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_half">
                <Field name="date" label="Date" required component={BossFormCalendar} />
              </div>
            </div>
          </div>
        </div>
        <div className="boss-form__row">
          <div className="boss-form__group boss-form__group_layout_max">
            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_layout_half">
                <Field
                  name="startsAt"
                  label="Starts At"
                  interval={30}
                  required
                  date={date}
                  disabled={!date}
                  component={BossFormTimeSelect}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_half">
                <Field
                  name="endsAt"
                  label="Ends At"
                  interval={30}
                  required
                  date={date}
                  disabled={!date}
                  component={BossFormTimeSelect}
                />
              </div>
            </div>
          </div>
        </div>
        <Field name="note" label="Note" component={BossFormTextArea} />
        <div className="boss-form__field">
          <button
            disabled={this.props.submitting || (!startsAt && startsAt !== 0) || (!endsAt && endsAt !== 0)}
            className={`boss-button boss-form__submit ${this.props.buttonClass}`}
          >
            {this.props.buttonText}
          </button>
        </div>
      </form>
    );
  }
}

SecurityShiftRequestForm.propTypes = {
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  onFormSubmit: PropTypes.func.isRequired,
};

SecurityShiftRequestForm.defaultProps = {
  buttonClass: 'boss-button_role_add',
  buttonText: 'Add New',
};

const withReduxFormSecurityShiftRequest = reduxForm({
  fields: ['assignedRotaShift'],
  onSubmit: onSubmit,
  form: 'security-shift-request-form',
})(SecurityShiftRequestForm);

const selector = formValueSelector('security-shift-request-form');

export default connect(state => {
  return {
    date: selector(state, 'date'),
    startsAt: selector(state, 'startsAt'),
    endsAt: selector(state, 'endsAt'),
  };
})(withReduxFormSecurityShiftRequest);
