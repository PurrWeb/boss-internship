import React from 'react';
import Select from 'react-select';
import humanize from 'string-humanize';
import _ from 'lodash';
import { List, Map } from 'immutable';

const BossFormSelect = ({
  label,
  className,
  options,
  optionValue,
  optionLabel,
  normalizeLabel,
  required,
  multi,
  placeholder,
  disabled,
  clearable = true,
  valueComponent = undefined,
  optionComponent = undefined,
  input: { onBlur, value, onChange, name },
  meta: { asyncValidating, touched, error },
  fieldClassName,
  selectClassNames,
  labelClassNames,
}) => {
  const getItemOption = (option, { value, label }) => {
    let normalizedLabel = null;

    if (typeof normalizeLabel === 'function') {
      normalizedLabel = normalizeLabel(option);
    }

    return {
      ...option,
      value: option[value || 'value'],
      label: normalizedLabel || option[label || 'label'],
    };
  };

  const getOptions = (options, { value, label }) => {
    return options.map((option, key) => {
      if (Object.prototype.toString.call(option) === '[object Object]') {
        return getItemOption(option, { value, label });
      } else {
        return {
          label: option,
          value: option,
        };
      }
    });
  };

  const onValueChange = value => {
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
  };

  const getValue = value => {
    if (List.isList(value)) {
      return value.toJS();
    }

    return value;
  };

  return (
    <div className={`boss-form__field ${className && className} ${fieldClassName && fieldClassName}`}>
      {label && (
        <label htmlFor={name} className={`boss-form__label ${labelClassNames ? labelClassNames : ''}`}>
          <span className="boss-form__label-text">{`${label} ${
            required ? '*' : ''
          }`}</span>
        </label>
      )}
      <div
        className={`boss-form__select ${selectClassNames ? selectClassNames : ''} ${touched &&
          error &&
          'boss-form__select_state_error'}`}
      >
        <Select
          options={getOptions(options, {
            label: optionLabel,
            value: optionValue,
          })}
          onChange={onValueChange}
          name={name}
          clearable={clearable}
          ignoreCase
          disabled={disabled}
          valueComponent={valueComponent}
          optionComponent={optionComponent}
          placeholder={placeholder || 'Select ...'}
          value={getValue(value)}
          multi={multi || false}
        />
      </div>
      {touched &&
        error && (
          <div className="boss-form__error">
            <p className="boss-form__error-text">
              <span className="boss-form__error-line">{error}</span>
            </p>
          </div>
        )}
    </div>
  );
};

export default BossFormSelect;
