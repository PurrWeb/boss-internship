import React from 'react';
import Select from 'react-select';
import humanize from 'string-humanize';
import _ from 'lodash';
import { List, Map } from 'immutable';

const BossFormSelect = ({
    label,
    options,
    optionValue,
    optionLabel,
    required,
    multi,
    placeholder,
    disabled,
    input: { onBlur, value, onChange, name },
    meta: { asyncValidating, touched, error },
  }) => {

  const getItemOption = (option, {value, label}) => {
    return {
        value: option[value || 'value'],
        label: option[label || 'label'],
    };
  }

  const getOptions = (options, {value, label}) => {
    return options.map((option, key) => {
      if (Object.prototype.toString.call(option) === '[object Object]') {
        return getItemOption(option, {value, label});
      } else {
        return {
          label: option,
          value: option
        }
      }
    });
  }

  const onValueChange = (value) => {
    if (value) {
      if (!multi) {
        if (Array.isArray(value) && !value.length) return;
        onChange(value.value);
      } else {
        onChange(value.map(value => value.value));
      }
    } else {
      onChange(value);
    }
  }
  
  const getValue = (value) => {
    if (List.isList(value)) {
      return value.toJS();
    };
    
    return value;
  }

  return (
    <div className="boss-form__field">
      <label htmlFor={name} className="boss-form__label">
        <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
      </label>
      <div className={`boss-form__select ${touched && error && 'boss-form__select_state_error'}`}>
        <Select
          options={getOptions(options, {label: optionLabel, value: optionValue})}
          onChange={onValueChange}
          name={name}
          ignoreCase
          disabled={disabled}
          placeholder={placeholder || 'Select ...'}
          value={getValue(value)}
          multi={multi || false}
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

export default BossFormSelect;