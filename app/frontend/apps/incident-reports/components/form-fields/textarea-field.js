import React from 'react';

const TextareaField = ({
    input,
    label,
    note,
    required,
    meta: { touched, error, warning },
  }) => {
    return (
      <div className="boss-form__field">
        <label className="boss-form__label">
          <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
        </label>
        <textarea {...input} placeholder={label} className={`boss-form__textarea boss-form__textarea_size_large ${touched && error && 'boss-form__textarea_state_error'}`} />
        <p className="boss-form__field-note">{note}</p>
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

  export default TextareaField;
