import React from 'react';
import _ from 'lodash';

const starterEmploymentStatusLabels = {
  employment_status_p45_supplied: 'I have supplied my P45 from my previous employer',
  employment_status_a: `This is my first job since the 6th of April. I have not been receiving taxable Jobseeker's Allowance, Incapacity Benefit or a state/occupational pernsion.`,
  employment_status_b: `This is now my only job. Since the 6th of April I have had another job, received taxable Jobseeker's Allowance or Incapacity Benefit. I do not receive a state/occupational pension.`,
  employment_status_c: `I have another job or receive a state/occupational pernsion.`,
  employment_status_d: `I left a course of higher education before the 6th of April & received my first student loan instalment on or after the 1st of September 1998 & I have not fully repaid my student loan.`
};


const BossFormEmployementStatus = ({
  label,
  required,
  input: { onBlur, value, onChange, name },
  meta: { touched, error, warning },
}) => {
  const renderOptions = (name, onChange, onBlur) => {
    return _.map(starterEmploymentStatusLabels, (statusLabel, key) => {
      return (
        <label key={key} className="boss-choice-list__radio-label">
          <input
            name={name}
            checked={key === value}
            value={key}
            onChange={onChange}
            onBlur={onBlur}
            type="radio"
            className="boss-choice-list__radio-button"
          />
          <span className="boss-choice-list__radio-label-text">
            {statusLabel}
          </span>
        </label>
      )
    })
  }

  return (
    <div className="boss-form__field">
      <div className="boss-choice-list">
        <div className="boss-choice-list__header">
          <div className="boss-choice-list__title">{label}</div>
        </div>
      </div>
      <div className="boss-choice-list__content">
        {touched &&
          error && (
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
          )}
        <p className="boss-choice-list__text">
          Tick one that applies
          </p>
        <div className="boss-choice-list__controls">
          {renderOptions(name, onChange, onBlur)}
        </div>
      </div>

    </div>
  )
}

export default BossFormEmployementStatus;
