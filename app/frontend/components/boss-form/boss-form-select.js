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
          value: key
        }
      }
    });
  }

  const onValueChange = (value) => {
    if (!multi) {
      if (Array.isArray(value) && !value.length) return;
    }
    onChange(value);
  }
  
  const getValue = (options, value, optionLabel, optionValue) => {
    if (Object.prototype.toString.call(value) === "[object String]") {
      return getOptions(options, {label: optionLabel, value: optionValue})
        .find((item, key) => item.label === value.trim());;
    } 
    
    if (List.isList(value) || Map.isMap(value)) {
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
          placeholder={placeholder || 'Select ...'}
          value={getValue(options, value, optionLabel, optionValue)}
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
