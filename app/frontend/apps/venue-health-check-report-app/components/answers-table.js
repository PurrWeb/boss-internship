import React from 'react';
import classnames from 'classnames';

import NotePopover from '../components/note-popover';

export default class AnswersTable extends React.Component {
  static displayName = 'AnswersTable';

  getAnswerForQuestion(question) {
    return this.props.answers.find(answer => {
      return answer.questionnaire_question_id == question.id;
    });
  }

  notePopoverProps(answer) {
    let { ...props } = this.props;

    return Object.assign(props, { currentAnswer: answer });
  }

  toggleNotePopup(e) {
    e.preventDefault();
    e.stopPropagation();

    let $allPopovers = $('.boss-popover')
    let $currentPopover = $(e.target).closest('.boss-results__group').find('.boss-popover');
    let $currentPopoverLink = $(e.target).closest('.boss-results__cell_action_popover');

    $currentPopover.fadeIn().addClass('boss-popover_state_opened');
  }

  renderAnswerGroups() {
    let answer;
    let answerValue;
    let noteIcon;
    let statusIcon;

    return this.props.categoryQuestions.map(question => {
      answer = this.getAnswerForQuestion(question);

      if (question.type !== 'ScaledQuestion') {
        console.log(question.type)
        if (answer.passed) {
          statusIcon = 'boss-results__cell_status_approved';
        } else {
          statusIcon = 'boss-results__cell_status_rejected';
        }
      } else {
        statusIcon = '';
      }

      noteIcon = (!answer.note && !answer.uploads.length) ?  '' : 'boss-results__cell_action_popover';

      return (
        <div className="boss-results__group" key={question.id}>
          <div className="boss-results__row">
            <div className={ `boss-results__cell ${statusIcon}` }><span className="boss-results__switch"></span></div>
            <div className="boss-results__cell">{ question.id }</div>
            <div className="boss-results__cell">{ question.text }</div>
            <div className="boss-results__cell">{ answer.value }</div>
            <div
              className={ `boss-results__cell ${noteIcon}` }
              data-popover={ question.id }
              onClick={ this.toggleNotePopup.bind(this) }
            >
            </div>
          </div>

          <NotePopover { ...this.notePopoverProps(answer) } />
        </div>
      )
    })
  }

  render() {
    return (
      <div className="boss-board__report">
        <div className="boss-board__results">
          <div className="boss-results">
            <div className="boss-results__row">
              <div className="boss-results__cell boss-results__cell_role_header">Result</div>
              <div className="boss-results__cell boss-results__cell_role_header">Number</div>
              <div className="boss-results__cell boss-results__cell_role_header">Name</div>
              <div className="boss-results__cell boss-results__cell_role_header">Answer</div>
              <div className="boss-results__cell boss-results__cell_role_header">Note</div>
            </div>

            { this.renderAnswerGroups() }
          </div>
        </div>
      </div>
    )
  }
}
