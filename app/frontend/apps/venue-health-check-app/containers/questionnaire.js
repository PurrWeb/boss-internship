import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CollapsibleCard from '../components/collapsible-card';
import VenueSelector from '../components/venue-selector';
import QuestionnaireFilter from '../components/questionnaire-filter';
import QuestionnaireActions from '../components/questionnaire-actions';

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
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        section: 'any',
        display: 'all',
        groupBy: 'section'
      }
    }
  }

  componentWillMount() {
    this.props.setInitialData(window.boss.venueHealthCheck);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.frontend.saved) {
      location.href = `/venue_health_check/${nextProps.currentVenue.name}/report`
    }
  }

  setFilter(filter) {
    let filters = this.state.filters;
    filters = Object.assign(filters, filter);

    this.setState({
      filters: filters
    })
  }

  commonProps() {
    let { ...props } = this.props;

    props = Object.assign(props, {
      setFilter: this.setFilter.bind(this),
      filters: this.state.filters
    });

    return props;
  }

  renderCollapsibleCardComponent() {
    let sectionFilter = this.state.filters.section;
    let groupByFilter = this.state.filters.groupBy;
    let filteredCategories = [];
    let filteredQuestions = [];
    let filterCategory;
    let categoryQuestions;
    let cardProps = {};

    if (sectionFilter == 'any') {
      filteredCategories = this.props.categories;
      filteredQuestions = this.props.questions;
    } else {
      filterCategory = this.props.categories.find(category => {
        return category.name == sectionFilter;
      });

      filteredCategories.push(filterCategory)
    }

    if (groupByFilter == 'section') {
      return filteredCategories.map(currentCategory => {
        categoryQuestions = this.props.questions.filter(question => {
          return (question.questionnaire_category_id == currentCategory.id);
        })

        cardProps = {
          currentCategory: currentCategory,
          categoryQuestions: categoryQuestions
        }

        cardProps = Object.assign(this.commonProps(), cardProps);

        return(
          <CollapsibleCard { ...cardProps } key={ currentCategory.id }>
          </CollapsibleCard>
        )
      });
    } else {
      filterCategory = this.props.categories.find(category => {
        return category.name == sectionFilter;
      });

      if (filterCategory) {
        categoryQuestions = this.props.questions.filter(question => {
          return (question.questionnaire_category_id == filterCategory.id);
        });
      } else {
        categoryQuestions = this.props.questions;
      }

      cardProps = {
        categoryQuestions: categoryQuestions
      }

      cardProps = Object.assign(this.commonProps(), cardProps);

      return(
        <CollapsibleCard { ...cardProps } >
        </CollapsibleCard>
      );
    }
  }

  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__dashboard">
          <div className="boss-page-main__inner">
            <VenueSelector { ...this.commonProps() } />

            <QuestionnaireActions { ...this.commonProps() } />

            <QuestionnaireFilter { ...this.commonProps() } />
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
