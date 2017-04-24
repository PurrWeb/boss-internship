import React from 'react';
import classnames from 'classnames';

import QuestionActions from './question-actions'

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

  toggleDisplayNote(e) {
    e.preventDefault();

    this.setState({
      displayNote: !this.state.displayNote
    })
  }

  activateAnsweredState() {
    this.setState({
      answered: true
    })
  }

  actionProps() {
    let cardProps = {
      activateAnsweredState: this.activateAnsweredState.bind(this),
      toggleDisplayNote: this.toggleDisplayNote.bind(this),
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

  saveNote(event) {
    event.preventDefault();

    this.props.setAnswer({
      questionId: this.props.currentQuestion.id,
      note: this.state.noteValue
    })
  }

  updateNoteValue(event) {
    this.setState({
      noteValue: event.target.value
    })
  }

  renderNote() {
    if (this.props.reviewMode) return '';

    return (
      <div className="boss-question__note" style={ this.displayNote() }>
        <div className="boss-question__note-inner">
          <textarea
            name="message"
            className="boss-question__message-textarea"
            placeholder="Type Notes Here..."
            value={this.state.noteValue}
            onChange={this.updateNoteValue.bind(this)}
          >
          </textarea>

          <div className="boss-question__end">
            <label className="boss-question__file-label">
              <input name="image" type="file" multiple="" className="boss-question__file-input" />
              <span className="boss-question__file-label-text">Add image</span>
            </label>

            <button
              className="boss-button boss-button_type_small boss-question__submit"
              type="submit"
              onClick={ this.saveNote.bind(this) }
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let answeredPointerClass = (this.state.answered) ? 'boss-questionnaire__pointer_state_active' : '';
    let answeredQuestionClass = (this.state.answered) ? 'boss-questionnaire__question_state_active' : '';

    return (
      <li className="boss-questionnaire__item">
        <p className={ `boss-questionnaire__pointer ${ answeredPointerClass }`}>
          <span className="boss-questionnaire__pointer-text">{ this.props.currentQuestion.id }</span>
        </p>

        <div className={ `boss-questionnaire__question ${ answeredQuestionClass }` }>
          <div className="boss-question">
            <form className="boss-question__form">
              <div className="boss-question__main">
                <div className="boss-question__info">
                  <p className="boss-question__number">Question { this.props.currentQuestion.id }</p>
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
