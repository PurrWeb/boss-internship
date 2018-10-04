import React, { Component } from 'react';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';

const START_DATE_FIELD_NAME = 'startDate';
const END_DATE_FIELD_NAME = 'endDate';

class BossFormDaterangePicker extends Component {
  static defaultProps = {
    label: null,
  };

  state = {
    focusedInput: null,
  };

  _handleDatesChange = ({ startDate, endDate }) => {
    this.props[START_DATE_FIELD_NAME].input.onChange(startDate);
    this.props[END_DATE_FIELD_NAME].input.onChange(endDate);
  };

  render() {
    const { label } = this.props;
    const startDate = this.props[START_DATE_FIELD_NAME];
    const endDate = this.props[END_DATE_FIELD_NAME];

    if (!startDate || !endDate) {
      throw new Error(
        `BossFormDaterangePicker: filed names '${START_DATE_FIELD_NAME}' & '${END_DATE_FIELD_NAME}' for the ReduxForm Fields component must be present.`,
      );
    }
    return (
      <div className="boss-form__field">
        {label && (
          <p className="boss-form__label">
            <span className="boss-form__label-text">{label}</span>
          </p>
        )}
        <div className="date-control date-control_type_icon date-control_type_interval-fluid date-control_adjust_third">
          <BossDateRangePicker
            startDateId="startDateId"
            endDateId="endDateId"
            startDate={startDate.input.value || null}
            endDate={endDate.input.value || null}
            onApply={this._handleDatesChange}
          />
        </div>
      </div>
    );
  }
}

export default BossFormDaterangePicker;
