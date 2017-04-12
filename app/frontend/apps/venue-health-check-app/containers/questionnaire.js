import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CollapsibleCard from '../components/collapsible-card';
import { setInitialData } from '../actions/initial-load'
import { setAnswer } from '../actions/answers'

function mapStateToProps(state) {
  return {
    questionnaire: state.venueHealthCheck.get('questionnaire'),
    categories: state.venueHealthCheck.get('categories'),
    questions: state.venueHealthCheck.get('questions'),
    questionnaireResponse: state.venueHealthCheck.get('questionnaireResponse')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData,
    setAnswer
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
      questions: this.props.questions,
      questionnaireResponse: this.props.questionnaireResponse,
      setAnswer: this.props.setAnswer,
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
      <div className="boss-page-main__inner">
        { this.renderCollapsibleCardComponent() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireContainer);
