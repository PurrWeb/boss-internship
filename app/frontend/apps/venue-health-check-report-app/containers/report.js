import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Header from '../components/header';
import CollapsibleCard from '../components/collapsible-card';

import { setInitialData } from '../actions/initial-load'

function mapStateToProps(state) {
  return {
    categories: state.venueHealthCheckReport.get('categories'),
    answers: state.venueHealthCheckReport.get('answers'),
    response: state.venueHealthCheckReport.get('response'),
    scores: state.venueHealthCheckReport.get('scores'),
    questions: state.venueHealthCheckReport.get('questions'),
    venues: state.venueHealthCheckReport.get('venues'),
    currentVenue: state.venueHealthCheckReport.get('currentVenue'),
    user: state.venueHealthCheckReport.get('user'),
    frontend: state.venueHealthCheckReport.get('frontend')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData
  }, dispatch);
}

export class ReportContainer extends React.Component {
  componentWillMount() {
    this.props.setInitialData(window.boss.venueHealthCheckReport);
  }

  getCategoryByName(categoryName) {
    return this.props.categories.find(category => {
      return category.name == categoryName;
    });
  }

  getQuestionsByCategory(category) {
    return this.props.questions.filter(question => {
      return question.questionnaire_category_id == category.id;
    });
  }

  getScoreByCategory(category) {
    return this.props.scores.find(score => {
      return score.questionnaire_category_id == category.id;
    });
  }

  renderCollapsibleCardComponent() {
    let { ...props } = this.props;
    let categoryQuestions = [];
    let cardProps;
    let currentScore;

    return this.props.categories.map(resource => {
      categoryQuestions = this.getQuestionsByCategory(resource);
      currentScore = this.getScoreByCategory(resource);

      cardProps = Object.assign(props, {
        currentCategory: resource,
        categoryQuestions: categoryQuestions,
        currentScore: currentScore
      });

      if (categoryQuestions.length == 0) return '';

      return(
        <CollapsibleCard { ...cardProps } key={ resource.id } />
      )
    });
  }

  render() {
    return (
      <main className="boss-page-main">
        <Header { ...this.props } />

        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            { this.renderCollapsibleCardComponent() }
          </div>
        </div>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportContainer);
