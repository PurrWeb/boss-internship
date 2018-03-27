import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import oFetch from 'o-fetch';
import RotaDate from '~/lib/rota-date';

import {
  getPossibleShiftStartTimeStrings,
  getPossibleShiftEndTimeStrings,
} from '~/lib/possible-shift-time-strings';

class FromTimeInterval extends React.Component {
  static propTypes = {};
  static defaultProps = {
    isFromBreaks: false,
    globalError: false,
  };

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

    let startsAt;
    const { isFromBreaks } = this.props;

    if (isFromBreaks) {
      startsAt = this.props.breaks[this.props.index].startsAt;
    } else {
      startsAt = oFetch(this.props, 'startsAt');
    }

    const newDate = shiftRotaDate.getDateFromShiftStartTimeString(newValue);
    startsAt.input.onChange(newDate);
  }

  updateEndsTime(newValue, shiftRotaDate) {
    if (!newValue.value) {
      return;
    }
    let endsAt;
    const { isFromBreaks } = this.props;

    if (isFromBreaks) {
      endsAt = this.props.breaks[this.props.index].endsAt;
    } else {
      endsAt = oFetch(this.props, 'endsAt');
    }

    const newDate = shiftRotaDate.getDateFromShiftEndTimeString(newValue);
    endsAt.input.onChange(newDate);
  }

  render() {
    let startsAt, endsAt;
    const { rotaDate, isFromBreaks, globalErrors } = this.props;
    if (isFromBreaks) {
      startsAt = this.props.breaks[this.props.index].startsAt;
      endsAt = this.props.breaks[this.props.index].endsAt;
    } else {
      startsAt = oFetch(this.props, 'startsAt');
      endsAt = oFetch(this.props, 'endsAt');
    }

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
        <div className="boss-time-shift__interval">
          <div className="boss-time-shift__hours">
            <p className="boss-time-shift__label">
              <span className="boss-time-shift__label-text">Start</span>
            </p>
            <div
              className={`boss-time-shift__select ${
                startsAt.meta.error ? 'boss-time-shift__select_state_error' : ''
              }`}
            >
              {selectStartAt}
            </div>
          </div>
          <div className="boss-time-shift__delimiter" />
          <div className="boss-time-shift__hours">
            <p className="boss-time-shift__label">
              <span className="boss-time-shift__label-text">End</span>
            </p>
            <div
              className={`boss-time-shift__select ${
                endsAt.meta.error ? 'boss-time-shift__select_state_error' : ''
              }`}
            >
              {selectEndsAt}
            </div>
          </div>
        </div>
        {(!globalErrors && (startsAt.meta.error || endsAt.meta.error)) ? (
          <div className="boss-time-shift__error">
            {!!startsAt.meta.error ? startsAt.meta.error.map((error, index) => <p key={index} className="boss-time-shift__error-text">
              {error}
            </p>) : null}
            {!!endsAt.meta.error ? endsAt.meta.error.map((error, index) => <p key={index} className="boss-time-shift__error-text">
              {error}
            </p>) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

FromTimeInterval.defaultProps = {
  granularityInMinutes: 30,
  className: '',
};

export default FromTimeInterval;
