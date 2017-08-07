import React from 'react';
import cn from 'classnames';
import _ from 'lodash';

import ErrorComponent from './error-component';

class ChecklistAnswer extends React.PureComponent {

  onNoteChange = _.debounce((value) => {
    return this.props.onNoteChange(value);
  }, 500);

  render() {
    const {
      answer,
      index,
      onAnswerChange,
      onNoteChange,
      showValidationErrors,
      isFormSubmitted,
      valid,
      error,
    } = this.props;

    const isAnswerValid = answer.get('answer') || !!answer.get('note');
    return (
      <div className="boss-checklist__item">
        <CheckBox
          onChange={onAnswerChange}
          answer={answer}
          index={index}
          isValid={valid}
          error={error}
          showValidationErrors={showValidationErrors}
        />
        <Note 
          onChange={this.onNoteChange}
          showNote={isFormSubmitted && !answer.get('answer')}
          value={answer.get('note')}
        />
      </div>
    )
  }
}

class CheckBox extends React.PureComponent{
  render() {
    const {
      answer,
      index,
      onChange,
      isValid,
      error,
    } = this.props;

    return (
      <div className="boss-checklist__control">
        <label className="boss-checklist__label">
          <input type="checkbox"
            className="boss-checklist__checkbox-input"
            onChange={(e) => onChange(e.target.checked)}
            checked={!!answer.get('answer')}
            value={!!answer.get('answer')}
          />
          <span className="boss-checklist__label-text  boss-checklist__label-text_type_checkbox">
            { answer.get('description') }
            { !isValid && <AnswerError>{error}</AnswerError> }
          </span>
        </label>
      </div>
    )
  }
}

const AnswerError = ({children}) => {
  return <span className="boss-checklist__label-text-error">
    { children }
  </span>
}

const Note = ({value, onChange, showNote}) => {
  return (
    <div className="boss-checklist__notes" style={{display: showNote ? 'block' : 'none'}}>
      <div className="boss-checklist__notes-inner">
        <textarea className="boss-checklist__notes-textarea"
          onChange={(e) => onChange(e.target.value)}
        >
          {value}
        </textarea>
      </div>
    </div>
  )
}

export default ChecklistAnswer;
