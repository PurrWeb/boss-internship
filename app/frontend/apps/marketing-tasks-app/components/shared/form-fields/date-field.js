import React from 'react';
import BossDatePicker from '~/components/react-dates/boss-date-picker';

class DateField extends React.Component {
  render() {
    const {
      input,
      options,
      label,
      required,
      type,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <span>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </p>
        <BossDatePicker 
          id="date"
          date={input.value}
          onApply={input.onChange}
          invalid={touched && error}
        />
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </span>
    )
  }

}

export default DateField;
