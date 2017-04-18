import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CollapsibleCard from '../components/collapsible-card';
import VenueSelector from '../components/venue-selector';
import QuestionnaireActions from '../components/questionnaire-actions'

import { setInitialData } from '../actions/initial-load'
import { setAnswer, saveAnswers } from '../actions/answers'

function mapStateToProps(state) {
  return {
    questionnaire: state.venueHealthCheck.get('questionnaire'),
    categories: state.venueHealthCheck.get('categories'),
    questions: state.venueHealthCheck.get('questions'),
    answers: state.venueHealthCheck.get('answers'),
    venues: state.venueHealthCheck.get('venues'),
    currentVenue: state.venueHealthCheck.get('currentVenue'),
    questionnaireResponse: state.venueHealthCheck.get('questionnaireResponse'),
    answerCount: state.venueHealthCheck.get('answerCount'),
    questionCount: state.venueHealthCheck.get('questionCount'),
    frontend: state.venueHealthCheck.get('frontend'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData,
    setAnswer,
    saveAnswers
  }, dispatch);
}

export class QuestionnaireContainer extends React.Component {
  componentWillMount() {
    this.props.setInitialData(window.boss.venueHealthCheck);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.frontend.saved) {
      location.href = `/venue_health_check/${nextProps.currentVenue.name}/report`
    }
  }

  commonProps() {
    return {
      questionnaire: this.props.questionnaire,
      categories: this.props.categories,
      questions: this.props.questions,
      questionnaireResponse: this.props.questionnaireResponse,
      setAnswer: this.props.setAnswer,
      saveAnswers: this.props.saveAnswers,
      venues: this.props.venues,
      currentVenue: this.props.currentVenue,
      frontend: this.props.frontend
    };
  }

  renderCollapsibleCardComponent() {
    return this.props.categories.map(currentCategory => {
      let categoryQuestions = this.props.questions.filter(question => {
        return (question.questionnaire_category_id == currentCategory.id);
      })

      let cardProps = {
        currentCategory: currentCategory,
        categoryQuestions: categoryQuestions
      }

      cardProps = Object.assign(this.commonProps(), cardProps);

      return(
        <CollapsibleCard { ...cardProps } key={ currentCategory.id }>
        </CollapsibleCard>
      )
    });
  }

  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__dashboard">
          <div className="boss-page-main__inner">
            <VenueSelector { ...this.props } />

            <QuestionnaireActions { ...this.props } />
          </div>
        </div>

        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            { this.renderCollapsibleCardComponent() }
          </div>
        </div>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireContainer);
