import React from 'react';
import classnames from 'classnames';

export default class QuestionnaireActions extends React.Component {
  static displayName = 'QuestionnaireActions';

  componentDidUpdate(prevProps, prevState) {
    let chartComponent = document.getElementsByClassName('boss-chart-questionnaire')[0];

    if (chartComponent) {
      chartComponent.innerHTML = '';
    }

    window.healthCheckChart.initialize();
  }

  saveAnswers() {
    this.props.saveAnswers(this.props.questionnaire.id, this.props.answers);
  }

  renderButtonState() {
    if (this.props.frontend.saving) {
      return 'Saving';
    } else if (this.props.frontend.saved) {
      return 'Saved';
    } else {
      return 'Submit';
    }
  }

  renderReview() {
    let alertBox = document.getElementsByClassName('boss-alert_role_page-note')[0];

    if (this.props.reviewMode) {
      if (this.props.questionCount > 0) alertBox.style['display'] = 'block';

      return(
        <div className="boss-page-dashboard__buttons-group">
          <a
            className="boss-button boss-button_role_success boss-page-dashboard__button"
            onClick={ this.saveAnswers.bind(this) }
          >
            { this.renderButtonState() }
          </a>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="boss-page-dashboard__group">
        <div className="boss-page-dashboard__chart">
          <div
            id="questionnaire-completeness"
            className="boss-chart-questionnaire"
            data-id="questionnaire-completeness"
            data-current={ this.props.questionCount - this.props.answerCount }
            data-total={ this.props.questionCount }
            data-size="70"
          >
          </div>
        </div>

        { this.renderReview() }
      </div>
    )
  }
}
