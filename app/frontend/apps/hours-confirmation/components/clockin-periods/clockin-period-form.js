import React, { Component } from 'react';
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

import FormReason from './form-components/form-reason';
import FormTimeInterval from './form-components/form-time-interval';

class ClockInPeriodForm extends Component {
  render() {
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
              name="reason"
              label="Reason"
              className="boss-time-shift__message"
              component={FormReason}
            />
            <div className="boss-time-shift__actions">
              <p className="boss-time-shift__status boss-time-shift__status_state_visible">
                <span className="boss-time-shift__status-count">
                  10h Accepted
                </span>
                <span className="boss-time-shift__status-meta">
                  by John Smith at 10:20 20/11/2017
                </span>
              </p>
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
