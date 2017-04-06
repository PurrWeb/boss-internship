import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CollapsibleCard from '../components/collapsible-card';
import { setInitialData } from '../actions/initial-load'

function mapStateToProps(state) {
  return {
    questionnaire: state.venueHealthCheck.get('questionnaire'),
    categories: state.venueHealthCheck.get('categories'),
    questions: state.venueHealthCheck.get('questions')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData
  }, dispatch);
}

export class QuestionnaireContainer extends React.Component {
  componentWillMount() {
    this.props.setInitialData(window.boss.venueHealthCheck);
  }

  commonProps() {
    return {
      questionnaire: this.props.questionnaire,
      categories: this.props.categories,
      questions: this.props.questions
    };
  }

  renderCollapsibleCardComponent() {
    return this.props.categories.map(currentCategory => {
      let categoryQuestions = this.props.questions.filter(question => {
        return (question.questionnaire_category_id == currentCategory.id);
      })

      let cardProps = {
        currentCategory: currentCategory,
        categoryQuestions: categoryQuestions,
        questionnaire: this.props.questionnaire
      }

      return(
        <CollapsibleCard { ...cardProps } key={ currentCategory.id }>
        </CollapsibleCard>
      )
    });
  }

  render() {
    return (
      <div className="boss-page-main__inner">
        { this.renderCollapsibleCardComponent() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireContainer);
