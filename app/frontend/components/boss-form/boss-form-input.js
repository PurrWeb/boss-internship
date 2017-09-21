import React from 'react';

const BossFormInput = ({
    input,
    label,
    required,
    type,
    disabled = false,
    meta: { touched, error, warning },
    meta,
    unit = '',
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <span className="boss-form__units">
          { !!unit && <span className="boss-form__units-value">{unit}</span>}
          <input {...input} type={type} disabled={disabled} placeholder={label} className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`} />
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
