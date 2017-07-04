import React from 'react';
import classnames from 'classnames';

import NotePopover from '../components/note-popover';

export default class AnswersTable extends React.Component {
  static displayName = 'AnswersTable';

  constructor(props) {
    super(props);

    this.state = {
      filterBy: 'number',
      filterAscending: true,
      categoryQuestions: this.props.categoryQuestions
    }
  }

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

  toggleSwitch(event) {
    let $target = $(event.target);
    let $targetMeta = $target.closest('.boss-results__group').find('.boss-results__meta');

    let $switches = $('.boss-results__switch').not($target);
    let $metas = $('.boss-results__meta').not($targetMeta);

    $switches.removeClass('boss-results__switch_state_opened');
    $metas.removeClass('boss-results__meta_state_opened');

    $target.toggleClass('boss-results__switch_state_opened');
    $targetMeta.toggleClass('boss-results__meta_state_opened');
  }

  renderAnswerGroups() {
    let answer;
    let answerValue;
    let noteIcon;
    let statusIcon;

    return this.state.categoryQuestions.map(question => {
      answer = this.getAnswerForQuestion(question);

      if (question.type !== 'ScaledQuestion') {
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
            <div className={ `boss-results__cell ${statusIcon}` }>
              <span className="boss-results__switch" onClick={ this.toggleSwitch.bind(this) }></span>
            </div>

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

          <div className="boss-results__meta">
            <div className="boss-results__meta-inner">
              <div className="boss-results__meta-item">
                <h4 className="boss-results__meta-label">Number</h4>
                <p className="boss-results__meta-value">{ question.id }</p>
              </div>

              <div className="boss-results__meta-item">
                <h4 className="boss-results__meta-label">Answer</h4>
                <p className="boss-results__meta-value">{ answer.value }</p>
              </div>
            </div>
          </div>

          <NotePopover { ...this.notePopoverProps(answer) } />
        </div>
      )
    })
  }

  setFilterBy(event) {
    let $target = $(event.target);
    let targetValue = $target.attr('data-filter-name');

    if (this.state.filterBy == targetValue) {
      this.setState({
        filterAscending: !this.state.filterAscending,
        categoryQuestions: this.getCategoryQuestionsByFilter(targetValue, !this.state.filterAscending)
      });
    } else {
      this.setState({
        filterBy: targetValue,
        filterAscending: true,
        categoryQuestions: this.getCategoryQuestionsByFilter(targetValue, true)
      });
    }
  }

  getCategoryQuestionsByFilter(filterBy, ascending) {
    let questions = [];

    switch(filterBy) {
      case 'result':
        questions = this.getQuestionsFilteredByResult(ascending);
        break;
      case 'number':
        questions = this.getQuestionsFilteredByNumber(ascending);
        break;
      case 'name':
        questions = this.getQuestionsFilteredByName(ascending);
        break;
    }

    return questions;
  }

  getQuestionsFilteredByResult(ascending) {
    let questions = this.props.categoryQuestions;
    let answer;

    let binaryQuestions = questions.filter(question => {
      return (question.type !== 'ScaledQuestion');
    });

    let scaledQuestions = questions.filter(question => {
      return (question.type === 'ScaledQuestion');
    });

    questions = binaryQuestions.sort(question => {
      answer = this.getAnswerForQuestion(question);

      if (ascending) {
        return (answer.passed);
      } else {
        return (!answer.passed);
      }
    });

    return questions.concat(scaledQuestions);
  }

  getQuestionsFilteredByNumber(ascending) {
    let sortedArray = this.props.categoryQuestions.sort(function(a, b){
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

    if (ascending) {
      return sortedArray;
    } else {
      return sortedArray.reverse();
    }
  }

  getQuestionsFilteredByName(ascending) {
    let sortedArray = this.props.categoryQuestions.sort(function(a, b){
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });

    if (ascending) {
      return sortedArray;
    } else {
      return sortedArray.reverse();
    }
  }

  render() {
    return (
      <div className="boss-board__report">
        <div className="boss-board__results">
          <div className="boss-results">
            <div className="boss-results__row">
              <div className="boss-results__cell boss-results__cell_role_header">
                Result

                <a className="boss-results__sort" data-filter-name="result" onClick={ this.setFilterBy.bind(this) }>Sort</a>
              </div>

              <div className="boss-results__cell boss-results__cell_role_header">
                Number

                <a className="boss-results__sort" data-filter-name="number" onClick={ this.setFilterBy.bind(this) }>Sort</a>
              </div>

              <div className="boss-results__cell boss-results__cell_role_header">
                Name

                <a className="boss-results__sort" data-filter-name="name" onClick={ this.setFilterBy.bind(this) }>Sort</a>
              </div>

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
