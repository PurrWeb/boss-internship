import React from 'react';
import classnames from 'classnames';

export default class ScoreChart extends React.Component {
  static displayName = 'ScoreChart';

  getInstantFailureAnswers() {
    let requiredQuestions = this.props.categoryQuestions.filter((question) => {
      return question.type == 'RequiredQuestion';
    });

    if (!requiredQuestions.length) return 0;

    let requiredQuestionIds = requiredQuestions.map((question) => {
      return question.id;
    });

    let failedRequiredAnswers = this.props.answers.filter((answer) => {
      return !answer.passed && requiredQuestionIds.includes(answer.questionnaire_question_id)
    });

    return failedRequiredAnswers.length;
  }

  render() {
    let currentScore = this.props.currentScore;

    if (currentScore.required_question_passed) {
      return (
        <div className="boss-board__chart">
          <div
            id={ `${ this.props.currentCategory.name.toLowerCase() }-score` }
            className="boss-chart-score"
            data-id={ `${ this.props.currentCategory.name.toLowerCase() }-score` }
            data-current={ this.props.currentScore.category_score }
            data-total={ this.props.currentScore.total_score }
            data-size="250"
          >
          </div>
        </div>
      );
    } else {
      return (
        <div className="boss-board__chart">
          <div
            id={ `${ this.props.currentCategory.name.toLowerCase() }-failures` }
            className="boss-chart-failures"
            data-id={ `${ this.props.currentCategory.name.toLowerCase() }-failures` }
            data-failures={ this.getInstantFailureAnswers() }
            data-current={ this.props.currentScore.category_score }
            data-total={ this.props.currentScore.total_score }
            data-size="250">
          </div>
        </div>
      );
    }
  }
}
