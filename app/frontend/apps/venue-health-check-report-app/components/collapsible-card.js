import React from 'react';
import classnames from 'classnames';

import AnswersTable from './answers-table'
import ScoreChart from './score-chart'

export default class CollapsibleCard extends React.Component {
  static displayName = 'CollapsibleCard';

  constructor(props) {
    super(props);

    this.state = {
      opened: !this.props.currentScore.passed
    };
  }

  componentDidMount() {
    let scoreCharts = document.getElementsByClassName('boss-chart-score');
    let failureCharts = document.getElementsByClassName('boss-chart-failures');

    for (var i = 0; i < scoreCharts.length; i++) {
      scoreCharts.item(i).innerHTML = '';
    }

    for (var i = 0; i < failureCharts.length; i++) {
      failureCharts.item(i).innerHTML = '';
    }

    window.initializeFailureCharts();
    window.initializeScoreCharts();
  }

  handleClick(e) {
    e.preventDefault();

    let $content = $(e.target).closest('.boss-board').find('.boss-board__content');
    let classToToggle = 'boss-board__content_state_opened';

    this.setState({
      opened: !this.state.opened
    });

    $content.slideToggle().end().toggleClass(classToToggle);
  }

  renderStatusBadge() {
    if (this.props.currentScore.passed) {
      return (
        <a className="boss-button boss-button_role_success_reverse boss-button_type_small boss-board__button">Pass</a>
      )
    } else {
      return (
        <a className="boss-button boss-button_role_fail_reverse boss-button_type_small boss-board__button">Fail</a>
      )
    }
  }

  render() {
    let categoryPassed = this.props.currentScore.passed;
    let iconStateClass = (this.state.opened) ? 'boss-board__switch_state_opened' : '';
    let sectionOpenClass = (this.state.opened) ? 'boss-board__content_state_opened' : '';
    let sectionPassClass = (categoryPassed) ? 'boss-board__header_status_passed' : 'boss-board__title_status_failed';
    let failedTitleClass = (categoryPassed) ? '' : 'boss-board__title_status_failed';

    return (
      <section className="boss-board boss-board_context_stack">
        <header className={ `boss-board__header ${sectionPassClass}` }>
          <h2 className={ `boss-board__title ${failedTitleClass}`}>{ this.props.currentCategory.name }</h2>

          <div className="boss-board__button-group">
            { this.renderStatusBadge() }
            <a
              className={ `boss-board__switch boss-board__switch_type_angle ${iconStateClass}` }
              href="#"
              onClick={ this.handleClick.bind(this) }
            ></a>
          </div>
        </header>

        <div className={ `boss-board__content ${sectionOpenClass}` }>
          <div className="boss-board__content-inner">
            <ScoreChart { ...this.props } />
            <AnswersTable { ...this.props } />
          </div>
        </div>
      </section>
    )
  }
}
