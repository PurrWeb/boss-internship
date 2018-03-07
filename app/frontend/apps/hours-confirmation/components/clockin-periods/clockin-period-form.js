import React, { Component } from 'react';
import oFetch from 'o-fetch';

import {
  Field,
  Fields,
  reduxForm,
  formValueSelector,
} from 'redux-form/immutable';

import {
  ErrorBlock,
  MossFormShiftTimeInput,
  MossFormCheckbox,
} from '~/components/boss-form';

import safeMoment from '~/lib/safe-moment';

import FormReason from './form-components/form-reason';
import FormTimeInterval from './form-components/form-time-interval';
import { getTimeDiff } from '../../selectors';

class ClockInPeriodForm extends Component {
  renderPendingActions(period) {
    const acceptanceDiff = getTimeDiff([period]);
    const acceptedBy = oFetch(period, 'acceptedBy') || 'N/A';
    const acceptedAt = oFetch(period, 'acceptedAt');
    const acceptedAtFormatted = acceptedAt ? safeMoment.iso8601Parse(acceptedAt) : 'N/A';

    return (
      <p className="boss-time-shift__status boss-time-shift__status_state_visible">
        <span className="boss-time-shift__status-count">
          {acceptanceDiff.fullTime} Accepted
        </span>
        <span className="boss-time-shift__status-meta">
          by {acceptedBy} at {acceptedAtFormatted}
        </span>
      </p>
    );
  }

  render() {
    const { period } = this.props;

    return (
      <form className="boss-time-shift__form">
        <div className="boss-time-shift__log">
          <div className="boss-time-shift__group">
            <Fields
              names={['startsAt', 'endsAt']}
              component={FormTimeInterval}
              granularityInMinutes={1}
              rotaDate="19-09-1984"
            />
            <Field
              name="reasonNote"
              label="Reason"
              className="boss-time-shift__message"
              component={FormReason}
            />
            <div className="boss-time-shift__actions">
              {this.renderPendingActions(period)}
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  values: ['id'],
})(ClockInPeriodForm);
