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

  render() {
    return (
      <CollapsibleCard { ...this.props } />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireContainer);
