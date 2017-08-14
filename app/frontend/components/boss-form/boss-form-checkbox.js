import React from 'react';

const BossFormCheckbox = ({
    input,
    label,
    required,
    type,
    meta: { touched, error, warning },
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__checkbox-label">
          <input {...input} type="checkbox" placeholder={label} className={`boss-form__checkbox-input ${touched && error && 'boss-form__checkbox-input_state_error'}`} />
          <input type="checkbox" className="boss-form__checkbox-input"/>
          <span className="boss-form__checkbox-label-text">
             {label}
          </span>
        </label>
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

  export default BossFormCheckbox;
