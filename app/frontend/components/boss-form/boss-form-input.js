import React from 'react';
import CurrencyInput from 'react-currency-input';

const BossFormInput = ({
    input,
    label,
    required,
    type,
    isCurrency = false,
    disabled = false,
    meta: { touched, error, warning },
    input: { onBlur, value, onChange, name },
    meta,
    unit = '',
    autocomplete = true
  }) => {

    const handleChange = (maskedvalue, floatvalue) => {
      onChange(floatvalue);
    }

    const renderInputs = () => {
      return (
        isCurrency
        ? <CurrencyInput
            disabled={disabled}
            value={value}
            onChange={handleChange}
            className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`}
            decimalSeparator="."
            thousandSeparator=""
          />
        : <input
            autoComplete={autocomplete ? 'on' : 'off'}
            {...input}
            type={type}
            disabled={disabled}
            placeholder={label}
            className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`}
          />
      )
    }

    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        { !!unit
          ? <span className="boss-form__units">
              <span className="boss-form__units-value">{unit}</span>
              {renderInputs()}
            </span>
          : renderInputs()
        }
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

  export default BossFormInput;
