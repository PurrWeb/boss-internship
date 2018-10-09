import React from 'react';

const BossFormTextarea = ({
  input,
  label,
  required,
  style = {},
  containerClasses = {},
  classNames = '',
  meta: { touched, error, warning },
  note,
  placeholder,
}) => {
  return (
    <div style={style} className={ `boss-form__field ${containerClasses}` }>
      <label className="boss-form__label">
        <span className="boss-form__label-text">{`${label} ${
          required ? '*' : ''
        }`}</span>
      </label>
      <textarea
        {...input}
        placeholder={placeholder || label}
        className={`boss-form__textarea ${classNames} ${touched &&
          error &&
          'boss-form__textarea_state_error'}`}
      />
      {note && <p className="boss-form__field-note">{note}</p>}
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
};

export default BossFormTextarea;
