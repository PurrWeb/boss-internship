import React from 'react';

const BossFormTextarea = ({
    input,
    label,
    required,
    meta: { touched, error, warning },
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <textarea {...input} placeholder={label} className={`boss-form__textarea ${touched && error && 'boss-form__textarea_state_error'}`} />
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

  export default BossFormTextarea;
