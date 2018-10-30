import React from 'react';
import BossDatePicker from '~/components/react-dates/boss-date-picker';


class BossFormCalendar extends React.Component {

  render () {
    const {
      label,
      required,
      input: { onBlur, value, onChange, name },
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div className="boss-form__field">
        {label && (
          <label className="boss-form__label">
            <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
          </label>
        )}
        <BossDatePicker
          date={value}
          onApply={onChange}
          invalid={!!touched && !!error}
        />
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

  export default BossFormCalendar;
