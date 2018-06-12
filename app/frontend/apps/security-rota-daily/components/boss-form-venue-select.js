import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Immutable from 'immutable';

class BossFormVenueSelect extends React.Component {
  handleChange = values => {
    this.props.input.onChange(values);
  };

  render() {
    const {
      label,
      options,
      valueKey,
      labelKey,
      clearable,
      placeholder,
      valueComponent,
      optionComponent,
      input: { name, value, onChange, onBlur },
      meta: { error, touched },
    } = this.props;

    return (
      <div className="boss-form__field">
        <label htmlFor={name} className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </label>
        <div className={`boss-form__select ${touched && error ? 'boss-form__select_state_error' : ''}`}>
          <Select
            name={name}
            value={value}
            valueKey={valueKey}
            labelKey={labelKey}
            onChange={this.handleChange}
            clearable={clearable}
            placeholder={placeholder}
            options={options}
            valueComponent={valueComponent}
            optionComponent={optionComponent}
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
  }
}

BossFormVenueSelect.propTypes = {};

BossFormVenueSelect.defaultProps = {
  clearable: false,
  valueComponent: undefined,
  optionComponent: undefined,
};

export default BossFormVenueSelect;
