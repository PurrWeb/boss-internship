import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import { getOveplappedRotaShifts } from '../../utils';
import safeMoment from '~/lib/safe-moment';
import { Field, reduxForm, SubmissionError, formValueSelector, Fields } from 'redux-form/immutable';
import BossFormShiftTimeInput from './boss-form-shift-time-input';

const onSubmit = (values, dispatch, props) => {
  const jsValues = values.toJS();
  return props.onFormSubmit(jsValues, dispatch).catch(resp => {
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

const validate = (values, props) => {
  const jsValues = values.toJS();
  const errors = {};
  const startsAt = oFetch(jsValues, 'startsAt');
  const endsAt = oFetch(jsValues, 'endsAt');
  const rotaShifts = oFetch(props, 'rotaShifts');

  const overlappedRotaShifts = getOveplappedRotaShifts(rotaShifts, startsAt, endsAt);

  if (overlappedRotaShifts.length > 0) {
    const overlappingTimes = overlappedRotaShifts.map(rotaShift => {
      const startTime = safeMoment.iso8601Parse(rotaShift.startsAt);
      const endTime = safeMoment.iso8601Parse(rotaShift.endsAt);
      const formattedTime = utils.shiftRequestIntervalFormat(startTime, endTime);
      return formattedTime;
    });

    errors._error = [`Shift overlaps existing (${overlappedRotaShifts.length}) shifts: ${overlappingTimes.join(", ")}`]
  }
  return errors;
};

const renderBaseError = errors => {
  return errors.map((error, index) => (
    <li key={index.toString()} className="boss-user-summary__review-item boss-user-summary__review-item_space_extra">
      <div className="boss-alert">
        <p className="boss-alert__text">
          <span className="boss-alert__text-marked">{error}</span>
        </p>
      </div>
    </li>
  ));
};

class AssignConfirmForm extends PureComponent {
  state = {
    isEditing: false,
  };

  toggleEditing = () => {
    this.setState({
      isEditing: !this.state.isEditing,
    });
  };

  render() {
    const { isEditing } = this.state;
    const { error, submitting } = this.props;
    const avatarUrl = oFetch(this.props, 'avatarUrl');
    const fullName = oFetch(this.props, 'fullName');
    const startsAt = oFetch(this.props, 'startsAt');
    const endsAt = oFetch(this.props, 'endsAt');
    const venueName = oFetch(this.props, 'venueName');
    const rotaShifts = oFetch(this.props, 'rotaShifts');

    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="boss-modal-window__message-block">
          <div className="boss-user-summary boss-user-summary_role_ssr-assign-confirmation">
            <div className="boss-user-summary__side">
              <div className="boss-user-summary__avatar">
                <div className="boss-user-summary__avatar-inner">
                  <img src={avatarUrl} alt="John Doe" className="boss-user-summary__pic" />
                </div>
              </div>
            </div>
            <div className="boss-user-summary__content">
              <div className="boss-user-summary__header">
                <h2 className="boss-user-summary__name">{fullName}</h2>
              </div>
              <ul className="boss-user-summary__review-list">
                {error && renderBaseError(error)}
                {!isEditing && (
                  <li className="boss-user-summary__review-item boss-user-summary__review-item_space_extra boss-user-summary__review-item_role_time">
                    {utils.shiftRequestIntervalFormat(
                      safeMoment.iso8601Parse(startsAt),
                      safeMoment.iso8601Parse(endsAt),
                    )}
                    <button
                      onClick={this.toggleEditing}
                      className="boss-button boss-button_type_extra-small boss-button_role_update boss-user-summary__review-action"
                    >
                      Edit
                    </button>
                  </li>
                )}
                {isEditing && (
                  <li className="boss-user-summary__review-item boss-user-summary__review-item_space_extra">
                    <div className="boss-form">
                      <Fields
                        names={['startsAt', 'endsAt']}
                        component={BossFormShiftTimeInput}
                        shiftStartsAt={startsAt}
                      />
                    </div>
                  </li>
                )}
                <li className="boss-user-summary__review-item boss-user-summary__review-item_role_date">
                  {utils.shiftRequestDayFormat(safeMoment.iso8601Parse(startsAt))}
                </li>

                <li className="boss-user-summary__review-item boss-user-summary__review-item_role_venue">
                  {venueName}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="boss-modal-window__actions">
          <button disabled={submitting} type="submit" className="boss-button boss-button_role_confirm">
            Confirm
          </button>
        </div>
      </form>
    );
  }
}

AssignConfirmForm.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
};

export default reduxForm({
  onSubmit: onSubmit,
  form: 'assign-confirm-form',
  validate,
})(AssignConfirmForm);
