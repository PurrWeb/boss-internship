import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

class BossFormSelect extends React.Component {

  render() {
    const {
      label,
      options,
      valueKey,
      labelKey,
      clearable,
      placeholder,
      multi,
      input: {name, value, onChange, onBlur},
      meta: {error, touched}
    } = this.props;

    return (
      <div className="boss-form__field">
        <label htmlFor={name} className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </label>
        <div className={`boss-form__select ${(touched && error) ? 'boss-form__select_state_error' : ''}`}>
          <Select
            name={name}
            value={value}
            valueKey={valueKey}
            labelKey={labelKey}
            onChange={onChange}
            clearable={clearable}
            simpleValue
            multi={multi}
            placeholder={placeholder}
            options={options}
          />
        </div>
        {
          (touched && error) &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }
}

BossFormSelect.propTypes = {
}

BossFormSelect.defaultProps = {
  clearable: false,
  multi: false,
}

export default BossFormSelect;
