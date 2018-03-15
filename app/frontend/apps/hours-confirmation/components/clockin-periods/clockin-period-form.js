import React, { Component } from 'react';
import oFetch from 'o-fetch';
import _ from 'lodash';
import uuid from 'uuid/v1';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Field,
  Fields,
  FieldArray,
  reduxForm,
  SubmissionError,
} from 'redux-form/immutable';

import RotaDate from '~/lib/rota-date';

import Immutable from 'immutable';

import {
  updatePeriodData,
  addNewAcceptancePeriodBreakAction,
} from '../../redux/actions';

import safeMoment from '~/lib/safe-moment';

import FormReason from './form-components/form-reason';
import FormTimeInterval from './form-components/form-time-interval';
import { getTimeDiff } from '../../selectors';
import humanize from 'string-humanize';

function createGlobalErrors(fieldsErrors) {}

function createFieldsErrors(values) {
  const errors = {
    breaks: [],
  };

  const mPeriodStarts = safeMoment.iso8601Parse(values.get('startsAt'));
  const mPeriodEnds = safeMoment.iso8601Parse(values.get('endsAt'));

  if (mPeriodStarts.isAfter(mPeriodEnds)) {
    errors.startsAt = [`Acceptance period start time can't be after end time`];
  }

  if (mPeriodEnds.isBefore(mPeriodStarts)) {
    errors.endsAt = [`Acceptance period end time can't be before start time`];
  }

  values.get('breaks').forEach((periodBreak, index) => {
    const mStarts = safeMoment.iso8601Parse(periodBreak.get('startsAt'));
    const mEnds = safeMoment.iso8601Parse(periodBreak.get('endsAt'));

    if (
      mStarts.isAfter(mEnds) ||
      mStarts.isBefore(mPeriodStarts) ||
      mStarts.isAfter(mPeriodEnds)
    ) {
      if (!_.isObject(errors.breaks[index])) {
        errors.breaks[index] = {};
      }
      if (!errors.breaks[index].startsAt) {
        errors.breaks[index].startsAt = [];
      }

      if (mStarts.isAfter(mEnds)) {
        errors.breaks[index].startsAt.push(
          `Break start time can't be after end time`,
        );
      }

      if (mStarts.isBefore(mPeriodStarts)) {
        errors.breaks[index].startsAt.push(
          `Break start time can't be before period start time`,
        );
      }
      if (mStarts.isAfter(mPeriodEnds)) {
        errors.breaks[index].startsAt.push(
          `Break start time can't be after period end time`,
        );
      }
    }

    if (mEnds.isAfter(mPeriodEnds) || mEnds.isBefore(mStarts)) {
      if (!_.isObject(errors.breaks[index])) {
        errors.breaks[index] = {};
      }
      if (!errors.breaks[index].endsAt) {
        errors.breaks[index].endsAt = [];
      }
      if (mEnds.isAfter(mPeriodEnds)) {
        errors.breaks[index].endsAt.push(
          `Break ends time can't be after period end time`,
        );
      }
      if (mEnds.isBefore(mStarts)) {
        errors.breaks[index].endsAt.push(
          `Break ends time can't be before end time`,
        );
      }
    }
  });

  return errors;
}

const validate = values => {
  const fieldsErrors = createFieldsErrors(values);
  return {
    ...fieldsErrors,
  };
};

class ClockInPeriodForm extends Component {
  state = {
    isOpened: false,
  };

  renderPendingActions(period) {
    const acceptanceDiff = getTimeDiff([period]);
    const acceptedBy = oFetch(period, 'acceptedBy') || 'N/A';
    const acceptedAt = oFetch(period, 'acceptedAt');
    const acceptedAtFormatted = acceptedAt
      ? safeMoment.iso8601Parse(acceptedAt)
      : 'N/A';
    const formInvalid = !oFetch(this.props, 'valid');

    return (
      <div className="boss-time-shift__actions">
        <button
          disabled={this.props.submitting}
          onClick={this.props.handleSubmit(values =>
            this.props.onAcceptPeriod(values.toJS()).catch(err => {
              if (err.response.data.errors) {
                throw new SubmissionError(err.response.data.errors);
              }
              return Promise.reject(new Error(err));
            }),
          )}
          className="boss-button boss-button_role_success boss-time-shift__button boss-time-shift__button_role_accept-shift"
        >
          Accepted{' '}
          <span className="boss-time-shift__button-count">
            {acceptanceDiff.fullTime}
          </span>
        </button>
        <button
          disabled={this.props.submitting}
          onClick={this.props.handleSubmit(this.props.onDeletePeriod)}
          className="boss-button boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_delete-shift"
        >
          Delete
        </button>
      </div>
    );
  }

  toggleBreaks = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  onAddBreak = fields => {
    const hoursAcceptancePeriod = this.props.period;
    const mDate = safeMoment.uiDateParse(oFetch(this.props.period, 'date'));
    const rotaDate = new RotaDate({
      dateOfRota: mDate.toDate(),
    });

    const shiftStartOffset = rotaDate.getHoursSinceStartOfDay(
      safeMoment.iso8601Parse(hoursAcceptancePeriod.startsAt).toDate(),
    );

    let breakHoursOffset = shiftStartOffset + 1;

    if (breakHoursOffset > 23) {
      breakHoursOffset = 23;
    }

    const newBreak = {
      id: null,
      frontendId: uuid(),
      hoursAcceptancePeriod: oFetch(hoursAcceptancePeriod, 'frontendId'),
      startsAt: rotaDate
        .getDateNHoursAfterStartTime(breakHoursOffset, 0)
        .toISOString(),
      endsAt: rotaDate
        .getDateNHoursAfterStartTime(breakHoursOffset, 15)
        .toISOString(),
    };

    fields.push(Immutable.fromJS(newBreak));
    // this.props.actions.addNewAcceptancePeriodBreakAction(newBreak);
  };

  renderBreaks = ({ fields, meta: { error, submitFailed } }) => {
    return (
      <div className="boss-time-shift__break-inner">
        {fields.map((periodBreak, index) => {
          const { period } = this.props;
          const date = oFetch(period, 'date');

          return (
            <div key={index} className="boss-time-shift__break-item">
              <div className="boss-time-shift__log boss-time-shift__log_layout_break">
                <Fields
                  names={[`${periodBreak}.startsAt`, `${periodBreak}.endsAt`]}
                  component={FormTimeInterval}
                  isFromBreaks={true}
                  index={index}
                  granularityInMinutes={1}
                  rotaDate={date}
                  globalErrors
                />
                <div className="boss-time-shift__actions">
                  <button
                    disabled={this.props.submitting}
                    onClick={() => fields.remove(index)}
                    type="button"
                    className="boss-button boss-button_type_icon boss-button_role_cancel boss-time-shift__button boss-time-shift__button_role_delete-break"
                  >
                    <i className="fa fa-remove" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div className="boss-time-shift__actions">
          <button
            type="button"
            onClick={() => this.onAddBreak(fields)}
            className="boss-button boss-button_role_add boss-time-shift__button boss-time-shift__button_role_add-break"
          >
            Add break
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { period, handleSubmit } = this.props;
    const date = oFetch(period, 'date');

    return (
      <form className="boss-time-shift__form">
        <div className="boss-time-shift__log">
          <div className="boss-time-shift__group">
            <Fields
              names={['startsAt', 'endsAt']}
              component={FormTimeInterval}
              granularityInMinutes={1}
              rotaDate={date}
            />
            <Field
              name="reasonNote"
              label="Reason"
              className="boss-time-shift__message"
              component={FormReason}
            />
            {this.renderPendingActions(period)}
          </div>
        </div>
        <div className="boss-time-shift__break">
          <div className="boss-time-shift__break-controls">
            <button
              type="button"
              onClick={this.toggleBreaks}
              className="boss-time-shift__break-toggle boss-time-shift__break-toggle_state_visible boss-time-shift__break-toggle_state_opened"
            >
              Breaks
            </button>
          </div>
          <div
            className="boss-time-shift__break-content boss-time-shift__break_state_opened"
            style={{ display: this.state.isOpened ? 'block' : 'none' }}
          >
            <FieldArray name="breaks" component={this.renderBreaks} />
          </div>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        addNewAcceptancePeriodBreakAction,
      },
      dispatch,
    ),
  };
};

ClockInPeriodForm = reduxForm({
  values: ['frontendId', 'id', 'date', 'staffMember'],
  // validate,
  onChange(values, dispatch, props) {
    dispatch(updatePeriodData(values));
  },
})(ClockInPeriodForm);

export default connect(null, mapDispatchToProps)(ClockInPeriodForm);
