import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

export default class Answer extends React.Component {
  static displayName = 'Answer';

  setOptionForQuestion(event) {
    if (this.props.reviewMode) {
      event.preventDefault();
      return;
    }

    this.props.activateAnsweredState();

    let questionnaireResponse = this.props.questionnaireResponse;
    let answers = questionnaireResponse.answers;
    let answerParams = {
      questionnaireQuestionId: this.props.currentQuestion.id,
      value: event.target.value
    };

    this.props.setAnswer(answerParams);
  }

  renderBinaryQuestionAnswer() {
    let question = this.props.currentQuestion;
    let possibleValues = this.props.currentQuestion.possible_values;
    let answer = (this.props.currentAnswer) ? this.props.currentAnswer.value : '';

    let answerOptions = possibleValues.map(possibleValue => {
      return(
        <label className="boss-question__radio-label" key={ this.props.currentQuestion.id + possibleValue }>
          <input
            type="radio"
            name={ this.props.currentQuestion.id }
            value={ possibleValue }
            className="boss-question__radio-button"
            onChange={ this.setOptionForQuestion.bind(this) }
            defaultChecked={ answer == possibleValue }
            disabled={ this.props.reviewMode }
          />
          <span className="boss-question__radio-label-text">{ possibleValue }</span>
        </label>
      )
    });

    return (
      <div className="boss-question__controls">
        { answerOptions }

        { this.renderIcon() }
      </div>
    )
  }

  renderIcon() {
    let answer = (this.props.currentAnswer) ? this.props.currentAnswer.value : '';

    if (this.props.reviewMode && answer) {
      return (
        <a className="boss-question__icon boss-question__icon_role_att">Attachment</a>
      );
    } else {
      return '';
    }
  }

  renderScaleQuestionAnswer() {
    let question = this.props.currentQuestion;
    let startValue = question.start_value;
    let endValue = question.end_value;
    let scaleRange = _.range(startValue, endValue + 1);
    let answer = (this.props.currentAnswer) ? this.props.currentAnswer.value : '';

    let answerOptions = scaleRange.map(scaleValue => {
      return(
        <label className="boss-question__radio-label" key={ this.props.currentQuestion.id + scaleValue }>
          <input
            type="radio"
            name={ this.props.currentQuestion.id }
            value={ scaleValue }
            className="boss-question__radio-button"
            onChange={ this.setOptionForQuestion.bind(this) }
            defaultChecked={ answer == scaleValue }
          />
          <span className="boss-question__radio-label-text">{ scaleValue }</span>
        </label>
      )
    });

    return (
      <div className="boss-question__controls">
        { answerOptions }

        { this.renderIcon() }
      </div>
    )
  }

  renderAnswer() {
    if (this.props.currentQuestion.type == 'BinaryQuestion') {
      return this.renderBinaryQuestionAnswer();
    } else if (this.props.currentQuestion.type == 'ScaledQuestion') {
      return this.renderScaleQuestionAnswer();
    }
  }

  render() {
    return(
      this.renderAnswer()
    );
  }
}
