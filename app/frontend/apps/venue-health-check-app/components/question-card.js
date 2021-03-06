import React from 'react';
import classnames from 'classnames';

import QuestionActions from './question-actions';
import FileUpload from './file-upload';
import FilePreview from './file-preview';
import './style.sass';

export default class QuestionCard extends React.Component {
  static displayName = 'QuestionCard';

  constructor(props) {
    super(props);

    this.state = {
      answered: !!this.props.currentAnswer,
      displayNote: false,
      noteValue: ''
    }
  }

  toggleDisplayNote = (e) => {
    this.setState({
      displayNote: !this.state.displayNote
    })
  }

  activateAnsweredState = () => {
    this.setState({
      answered: true
    })
  }

  actionProps() {
    let cardProps = {
      activateAnsweredState: this.activateAnsweredState,
      toggleDisplayNote: this.toggleDisplayNote,
      displayNote: this.state.displayNote,
    }

    return (Object.assign(cardProps, this.props));
  }

  displayNote() {
    if (this.state.displayNote) {
      return { display: 'block' }
    } else {
      return { }
    }
  }

  saveNote = (event) => {
    event.preventDefault();

    const result = this.props.checkAnswer({
      questionnaireQuestionId: this.props.currentQuestion.id,
      note: this.state.noteValue
    });


    if (result) {
      this.toggleDisplayNote();
    }
  }

  updateNoteValue = (event) => {
    this.setState({
      noteValue: event.target.value
    })
  }

  renderNote() {
    return (
      <div className="boss-question__note" style={ this.displayNote() }>
        <div className="boss-question__note-inner">
          <textarea
            name="message"
            className="boss-question__message-textarea"
            placeholder="Type Notes Here..."
            value={this.state.noteValue}
            onChange={this.updateNoteValue}
          >
          </textarea>

          <div className="boss-question__end">
            <FileUpload { ...this.actionProps() } />
            <FilePreview { ...this.actionProps() } />

            <button
              className="boss-button boss-button_type_small boss-question__submit"
              type="submit"
              onClick={ this.saveNote }
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const isWrong = this.props.wrongFiles.includes(this.props.currentQuestion.id);
    let answeredPointerActiveClass = (this.state.answered) ? 'boss-questionnaire__pointer_state_active' : '';
    let answeredQuestionActiveClass = (this.state.answered) ? 'boss-questionnaire__question_state_active' : '';
    const answeredPointerClass = isWrong ? 'boss-questionnaire__pointer_state_wrong' : answeredPointerActiveClass;
    const answeredQuestionClass = isWrong ? 'boss-questionnaire__question_state_wrong' : answeredQuestionActiveClass;

    return (
      <li className="boss-questionnaire__item">
        <p className={ `boss-questionnaire__pointer ${ answeredPointerClass }`}>
          <span className="boss-questionnaire__pointer-text">{ this.props.questionNumber }</span>
        </p>

        <div className={ `boss-questionnaire__question ${ answeredQuestionClass }` }>
          <div className="boss-question">
            <form className="boss-question__form">
              <div className="boss-question__main">
                <div className="boss-question__info">
                  <p className="boss-question__number">Question { this.props.questionNumber }</p>
                  <h3 className="boss-question__subject">{ this.props.currentQuestion.text }</h3>
                </div>

                <QuestionActions { ...this.actionProps() } />
              </div>

              { this.renderNote() }
            </form>
          </div>
        </div>
      </li>
    )
  }
}
