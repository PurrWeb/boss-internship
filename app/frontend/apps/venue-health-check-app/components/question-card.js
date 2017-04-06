import React from 'react';
import classnames from 'classnames';

export default class QuestionCard extends React.Component {
  static displayName = 'QuestionCard';

  render() {
    return (
      <li className="boss-questionnaire__item">
        <p className="boss-questionnaire__pointer">
          <span className="boss-questionnaire__pointer-text">{ this.props.currentQuestion.id }</span>
        </p>

        <div className="boss-questionnaire__question">
          <div className="boss-question">
            <form className="boss-question__form">
              <div className="boss-question__main">
                <div className="boss-question__info">
                  <p className="boss-question__number">Question { this.props.currentQuestion.id }</p>
                  <h3 className="boss-question__subject">{ this.props.currentQuestion.text }</h3>
                </div>
              </div>
            </form>
          </div>
        </div>
      </li>
    )
  }
}
