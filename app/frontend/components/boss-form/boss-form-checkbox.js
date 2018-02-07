import React from 'react';

class BossFormCheckbox extends React.Component {
  render() {
    const {
      input,
      label,
      required,
      className = '',
      type = 'checkbox',
      meta: { touched, error, warning },
    } = this.props;
    return (
      <div className={`boss-form__field ${className}`}>
        <label className="boss-form__checkbox-label">
          <input
            {...input}
            type={type}
            placeholder={label}
            className={`boss-form__checkbox-input ${touched && error && 'boss-form__checkbox-input_state_error'}`}
          />
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
}

export default BossFormCheckbox;
