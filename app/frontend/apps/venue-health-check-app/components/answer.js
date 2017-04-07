import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

export default class Answer extends React.Component {
  static displayName = 'Answer';

  setOptionForQuestion(e) {
    // TODO: save state on answer reducer.
  }

  renderBinaryQuestionAnswer() {
    return (
      <div className="boss-question__controls">
        <label className="boss-question__radio-label">
          <input type="radio" name="choice" value="yes" className="boss-question__radio-button" />
          <span className="boss-question__radio-label-text">Yes</span>
        </label>

        <label className="boss-question__radio-label">
          <input type="radio" name="choice" value="no" className="boss-question__radio-button" />
          <span className="boss-question__radio-label-text">No</span>
        </label>
      </div>
    )
  }

  renderScaleQuestionAnswer() {
    let question = this.props.currentQuestion;
    let startScale = question.start_scale;
    let endScale = question.end_scale;
    let scaleRange = _.range(startScale, endScale + 1);

    let answerOptions = scaleRange.map(scale => {
      return(
        <label className="boss-question__radio-label">
          <input
            type="radio"
            name={ this.props.currentQuestion.id }
            value={ scale }
            className="boss-question__radio-button"
            onChange={ this.setOptionForQuestion.bind(this) }
          />
          <span className="boss-question__radio-label-text">{ scale }</span>
        </label>
      )
    });

    return (
      <div className="boss-question__controls">
        { answerOptions }
      </div>
    )
  }

  renderAnswer() {
    if (this.props.currentQuestion.type == 'BinaryQuestion') {
      return this.renderBinaryQuestionAnswer();
    } else if (this.props.currentQuestion.type == 'BinaryQuestion') {
      return this.renderScaleQuestionAnswer();
    }
  }

  render() {
    return(
      this.renderAnswer()
    );
  }
}
