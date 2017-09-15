import React from 'react';

const InputInlineField = ({
    input,
    label,
    required,
    type,
    meta: { touched, error, warning },
    meta,
  }) => {
    return (
      <div className="boss-form__row">
        <div className="boss-form__field boss-form__field_role_label-small boss-form__field_position_last">
          <p className="boss-form__label">
            <span className="boss-form__label-text boss-form__label-text_type_inline-fluid">
              {label}
            </span>
          </p>
        </div>
        <div className="boss-form__field boss-form__field_layout_max">
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
      </div>
    )
  }

  export default InputInlineField;
