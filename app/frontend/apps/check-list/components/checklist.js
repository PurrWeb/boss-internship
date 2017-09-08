import React from 'react';
import cn from 'classnames';
import {Collapse} from 'react-collapse';

import CheckListWrapper from './checklist-wrapper';
import ChecklistAnswer from './checklist-answer';
import {ErrorWarning, ErrorMessage} from './check-list-error-messages';

import ValidationComponent from './validation-component';
import ValidationControl from './validation-control';
import ErrorComponent from './error-component';

import {
  SUBMITTING_VALIDATION_WARNING,
  SUBMITTING_VALIDATION_ERROR,
} from '../constants/notifications';


class CheckValidation extends React.PureComponent {
  render() {
    const {answer, error} = this.props;
    return <div>{answer.get('description')}</div>
  }
}

const CheckList = ({
  checklist,
  onAnswerChange,
  onSubmit,
  onNoteChange,
  onToggleOpen,
  errors}) => {

  const validationErrors = errors
    ? errors.get(`checklist.${checklist.get('id')}`) ? errors.get(`checklist.${checklist.get('id')}`).toJS() : null
    : null;
  
  const form = checklist.get('form');
  const isValid = !validationErrors;
  const isOpen = checklist.get('isOpen');
  const submittedFailed = form.get('submittedFailed');
  const isSubmitted = form.get('submitted');
  const showValidationErrors = !isValid;
  const items = checklist.get('items');
  const buttonClass = cn('boss-board__switch boss-board__switch_type_angle', {'boss-board__switch_state_opened': isOpen}),
        titleClass = cn('boss-board__title', {'boss-board__title_status_failed': showValidationErrors});

  return (
    <ValidationComponent
      parent={`checklist.${checklist.get('id')}`}
    >
      <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className={titleClass}>
            { checklist.get('name') }
          </h2>
          <div className="boss-board__button-group">
              <button onClick={onToggleOpen} className={buttonClass}></button>
          </div>
        </header>
          <Collapse isOpened={isOpen}>
            <CheckListWrapper>
              <ErrorComponent
                model="base"
                component={ErrorMessage}
              />
              
              <div className="boss-checklist__items">
                { items.map((answer, index) => {
                  return (
                    <ValidationControl
                      key={answer.get('id')}
                      model={`answer.${index}`}
                      component={ChecklistAnswer}
                      mappedProps={{
                        answer: answer,
                        onAnswerChange: (value) => onAnswerChange(answer.get('id'), value),
                        onNoteChange: (value) => onNoteChange(answer.get('id'), value),
                        index: index,
                        showValidationErrors: showValidationErrors,
                        isFormSubmitted: isSubmitted
                      }}
                    />
                  )
                }) }
              </div>
              <div className="boss-checklist__actions">
                <button
                  onClick={onSubmit}
                  className="boss-button boss-button_role_primary boss-checklist__action"
                >Submit</button>
              </div>
            </CheckListWrapper>
          </Collapse>         
      </section>
    </ValidationComponent>
  )
}

export default CheckList;
