import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import RotaDate from '~/lib/rota-date';

import {
  getPossibleShiftStartTimeStrings,
  getPossibleShiftEndTimeStrings,
} from '~/lib/possible-shift-time-strings';

class FromTimeInterval extends React.Component {
  static propTypes = {};

  getStartsAtOptions = (input, callback, shiftRotaDate) => {
    callback(null, {
      options: getPossibleShiftStartTimeStrings(
        this.props.granularityInMinutes,
        shiftRotaDate.startTime,
      ).map(timeString => ({ value: timeString, label: timeString })),
      complete: true,
    });
  };

  getEndsAtOptions = (input, callback, shiftRotaDate) => {
    callback(null, {
      options: getPossibleShiftEndTimeStrings(
        this.props.granularityInMinutes,
        shiftRotaDate.startTime,
      ).map(timeString => ({ value: timeString, label: timeString })),
      complete: true,
    });
  };

  updateStartsTime(newValue, shiftRotaDate) {
    if (!newValue.value) {
      return;
    }
    const newDate = shiftRotaDate.getDateFromShiftStartTimeString(newValue);
    this.props.startsAt.input.onChange(newDate);
  }

  updateEndsTime(newValue, shiftRotaDate) {
    if (!newValue.value) {
      return;
    }
    const newDate = shiftRotaDate.getDateFromShiftEndTimeString(newValue);
    this.props.endsAt.input.onChange(newDate);
  }

  render() {
    const { startsAt, endsAt, rotaDate } = this.props;

    const dRotaDate = safeMoment.uiDateParse(rotaDate).toDate();

    const shiftRotaDate = new RotaDate({
      dateOfRota: dRotaDate,
    });

    const timeStartsAt = startsAt.input.value;
    const timeEndsAt = endsAt.input.value;
    const sStartsAtDateValue = moment(timeStartsAt).format('HH:mm');
    const sEndsAtDateValue = moment(timeEndsAt).format('HH:mm');

    const selectStartAt = (
      <Select.Async
        value={sStartsAtDateValue}
        loadOptions={(input, callback) =>
          this.getStartsAtOptions(input, callback, shiftRotaDate)
        }
        clearable={false}
        searchable={true}
        onChange={value => this.updateStartsTime(value, shiftRotaDate)}
      />
    );
    const selectEndsAt = (
      <Select.Async
        value={sEndsAtDateValue}
        loadOptions={(input, callback) =>
          this.getEndsAtOptions(input, callback, shiftRotaDate)
        }
        clearable={false}
        searchable={true}
        onChange={value => this.updateEndsTime(value, shiftRotaDate)}
      />
    );

    return (
      <div className={`boss-time-shift__time`}>
        <div className="boss-form__interval">
          <div className="boss-form__interval-item">
            <p className="boss-form__label">
              <span className="boss-form__label-text">Start</span>
            </p>
            <div
              className={`boss-form__select boss-form__select_role_time ${startsAt
                .meta.touched &&
                startsAt.meta.error &&
                'boss-form__select_state_error'}`}
            >
              {selectStartAt}
            </div>
            {startsAt.meta.touched &&
              startsAt.meta.error && (
                <div className="boss-form__error">
                  <p className="boss-form__error-text">
                    <span className="boss-form__error-line">
                      {startsAt.meta.error}
                    </span>
                  </p>
                </div>
              )}
          </div>
          <div className="boss-form__interval-delimiter" />
          <div className="boss-form__interval-item">
            <p className="boss-form__label">
              <span className="boss-form__label-text">End</span>
            </p>
            <div
              className={`boss-form__select boss-form__select_role_time ${endsAt
                .meta.touched &&
                endsAt.meta.error &&
                'boss-form__select_state_error'}`}
            >
              {selectEndsAt}
            </div>
            {endsAt.meta.touched &&
              endsAt.meta.error && (
                <div className="boss-form__error">
                  <p className="boss-form__error-text">
                    <span className="boss-form__error-line">
                      {endsAt.meta.error}
                    </span>
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

FromTimeInterval.defaultProps = {
  granularityInMinutes: 30,
  className: '',
};

export default FromTimeInterval;
