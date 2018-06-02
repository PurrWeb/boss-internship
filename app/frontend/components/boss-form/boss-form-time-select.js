import React from 'react';
import Select from 'react-select';
import humanize from 'string-humanize';
import _ from 'lodash';
import { List, Map } from 'immutable';
import { getPossibleShiftStartTimeStrings, getPossibleShiftEndTimeStrings } from "~/lib/possible-shift-time-strings"
import getSamplingTimeOffsetsForDay from "~/lib/get-sampling-time-offsets-for-day"
import moment from 'moment';

const BossFormTimeSelect = ({
    label,
    required,
    interval,
    placeholder,
    date,
    input: { onBlur, value, onChange, name },
    meta: { asyncValidating, touched, error },
    disabled = false,
  }) => {

  const getRotaDate = (date) => {
    return moment(date).hours(8).minutes(0).seconds(0);
  }

  const getPosibleTimeValues = (interval) => {
    return getSamplingTimeOffsetsForDay(interval);
  }

  const getOptions = (interval, date) => {
    let time = date.clone();
    return getPosibleTimeValues(interval).map((offset, index) => {
      if (index !== 0) {
        time.add(interval, 'minutes');
      }

      return  {
        value: offset,
        label: moment(time).format("HH:mm"),
      }
    })
  }

  const onValueChange = (value) => {
    if (Array.isArray(value) && !value.length) return;
    onChange(value);
  }

  return (
    <div className="boss-form__field">
      <label htmlFor={name} className="boss-form__label">
        <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
      </label>
      <div className={`boss-form__select ${touched && error && 'boss-form__select_state_error'}`}>
        <Select
          options={getOptions(interval, getRotaDate(date))}
          onChange={onValueChange}
          name={name}
          placeholder={placeholder || 'Select ...'}
          value={value}
          disabled={disabled}
        />
      </div>
      {
        touched && error &&
          <div className="boss-form__error">
            <p className="boss-form__error-text">
              <span className="boss-form__error-line">{error}</span>
            </p>
          </div>
      }
    </div>
  )
}

export default BossFormTimeSelect;
