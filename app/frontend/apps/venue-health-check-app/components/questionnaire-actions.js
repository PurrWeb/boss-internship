import React from 'react';
import classnames from 'classnames';

export default class QuestionnaireActions extends React.Component {
  static displayName = 'QuestionnaireActions';

  componentDidUpdate(prevProps, prevState) {
    let chartComponent = document.getElementsByClassName('boss-chart-questionnaire')[0];

    if (chartComponent) {
      chartComponent.innerHTML = '';
    }

    initializeCompletenessCharts();
  }

  saveAnswers = () => {
    this.props.saveAnswers(this.props.questionnaire.id, this.props.answers, this.props.currentVenue.id);
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
      return(
        <div className="boss-page-dashboard__buttons-group">
          {this.props.wrongFiles.length === 0
            ? <button
                type="button"
                className="boss-button boss-button_role_success boss-page-dashboard__button"
                onClick={this.saveAnswers}
              >{this.renderButtonState()}</button>
            : <div className="boss-form__error">
                <p className="boss-form__error-text">
                  <span className="boss-form__error-line">You uploaded files with wrong format, please remove them first</span>
                </p>
              </div>
          }
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
