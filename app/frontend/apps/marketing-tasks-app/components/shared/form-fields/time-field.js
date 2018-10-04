import React from 'react';
import TimePicker from 'rc-time-picker';
import safeMoment from "~/lib/safe-moment";

import 'rc-time-picker/assets/index.css';

export default class TimeField extends React.Component {
  render() {
    const {
      input,
      options,
      label,
      required,
      type,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <span>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </p>

        <TimePicker
          { ...input }
          className={`time-picker-input time-picker-input_type_icon ${touched && error && 'time-picker-input_state_error'}`}
          placeholder="Select time ..."
          value={ input.value ? safeMoment.iso8601Parse(input.value) : null }
          hideDisabledOptions
          showSecond={false}
          onChange={input.onChange}
        />
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </span>
    )
  }
}
