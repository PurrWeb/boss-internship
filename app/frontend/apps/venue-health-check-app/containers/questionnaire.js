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
    areas: state.venueHealthCheck.get('areas'),
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
        groupBy: 'section',
        area: 'any'
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

  reviewMode() {
    return (this.props.questionCount == this.props.answerCount);
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
      filters: this.state.filters,
      reviewMode: this.reviewMode()
    });

    return props;
  }

  getCategoryByName(categoryName) {
    return this.props.categories.find(category => {
      return category.name == categoryName;
    });
  }

  getAreaByName(areaName) {
    return this.props.areas.find(area => {
      return area.name == areaName;
    });
  }

  getCurrentAnswer(question) {
    return this.props.answers.find(answer => {
      return answer.questionId == question.id;
    });
  }

  filterDisplayQuestions(questions) {
    if (this.state.filters.display == 'unanswered') {
      return questions.filter(question => {
        return !!!this.getCurrentAnswer(question);
      });
    } else {
      return questions;
    }
  }

  getQuestions() {
    let sectionFilter = this.state.filters.section;
    let areaFilter = this.state.filters.area;
    let currentCategory = this.getCategoryByName(sectionFilter);
    let currentArea = this.getAreaByName(areaFilter);

    let questions = this.props.questions.filter(question => {
      if (sectionFilter != 'any' && areaFilter != 'any') {
        return(
          (question.questionnaire_category_id == currentCategory.id)
            && (question.questionnaire_area_id == currentArea.id)
        );
      } else if (sectionFilter == 'any' && areaFilter != 'any') {
        return question.questionnaire_area_id == currentArea.id;
      } else if (sectionFilter != 'any' && areaFilter == 'any') {
        return question.questionnaire_category_id == currentCategory.id;
      } else {
        return true;
      }
    });

    return this.filterDisplayQuestions(questions);
  }

  getQuestionsByCategoryName(categoryName) {
    let category = this.getCategoryByName(categoryName);

    return this.getQuestions().filter(question => {
      return question.questionnaire_category_id == category.id;
    });
  }

  getQuestionsByAreaName(areaName) {
    let area = this.getAreaByName(areaName);

    return this.getQuestions().filter(question => {
      return question.questionnaire_area_id == area.id;
    });
  }

  getCategorySections() {
    let sectionFilter = this.state.filters.section;
    let categories = [];

    if (sectionFilter != 'any') {
      categories.push(this.props.categories.find(category => {
        return category.name == sectionFilter;
      }));

      return categories;
    } else {
      return this.props.categories;
    }
  }

  getAreaSections() {
    let areaFilter = this.state.filters.area;
    let areas = [];

    if (areaFilter != 'any') {
      areas.push(this.props.areas.find(area => {
        return area.name == areaFilter;
      }));

      return areas;
    } else {
      return this.props.areas;
    }
  }

  getResourceForCollapsibleCard() {
    let groupByFilter = this.state.filters.groupBy;
    let viewSections = [];

    if (groupByFilter == 'section') {
      viewSections = this.getCategorySections();
    } else if (groupByFilter == 'area') {
      viewSections = this.getAreaSections();
    } else {
      viewSections;
    }

    return viewSections;
  }

  renderCollapsibleCardComponent() {
    let cardProps = {};
    let categoryQuestions = [];
    let groupByFilter = this.state.filters.groupBy;

    if (groupByFilter != 'question') {
      return this.getResourceForCollapsibleCard().map(resource => {
        if (groupByFilter == 'section') {
          categoryQuestions = this.getQuestionsByCategoryName(resource.name)
        } else if (groupByFilter == 'area') {
          categoryQuestions = this.getQuestionsByAreaName(resource.name)
        }

        cardProps = Object.assign(this.commonProps(), {
          currentCategory: resource,
          categoryQuestions: categoryQuestions
        });

        if (categoryQuestions.length == 0) return '';

        return(
          <CollapsibleCard { ...cardProps } key={ resource.id }></CollapsibleCard>
        )
      });
    } else {
      categoryQuestions = this.getQuestions();

      cardProps = Object.assign(this.commonProps(), {
        categoryQuestions: categoryQuestions
      });

      return(
        <CollapsibleCard { ...cardProps }></CollapsibleCard>
      )
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
