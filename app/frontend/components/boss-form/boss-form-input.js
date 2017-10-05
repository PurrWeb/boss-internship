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
  }) => {

    const handleChange = (maskedvalue, floatvalue) => {
      onChange(floatvalue);
    }   
  
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <span className="boss-form__units">
          { !!unit && <span className="boss-form__units-value">{unit}</span>}
          {isCurrency
            ? <CurrencyInput disabled={disabled} value={value} onChange={handleChange} className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`} decimalSeparator="." thousandSeparator=""/>
            : <input {...input} type={type} disabled={disabled} placeholder={label} className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`} />
          }
        </span>
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
