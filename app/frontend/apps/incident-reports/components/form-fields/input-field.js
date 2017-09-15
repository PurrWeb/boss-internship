import React from 'react';

const InputField = ({
    input,
    label,
    required,
    type,
    meta: { touched, error, warning },
    meta,
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <input {...input} type={type} placeholder={label} className={`boss-form__input ${touched && error && 'boss-form__input_state_error'}`} />
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

  export default InputField;
