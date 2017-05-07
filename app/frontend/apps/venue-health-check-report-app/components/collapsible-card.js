import React from 'react';
import classnames from 'classnames';

import AnswersTable from './answers-table'

export default class CollapsibleCard extends React.Component {
  static displayName = 'CollapsibleCard';

  constructor(props) {
    super(props);

    this.state = {
      opened: !this.props.currentScore.passed
    };
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

  renderScore() {
    let currentScore = this.props.currentScore;
    let totalScore = currentScore.total_score || 0;

    if (!currentScore.required_question_passed && parseInt(totalScore) === 0) return;

    return (
      <div className="boss-chart__score">
        <p className="boss-chart__score-label">Score</p>
        <p className="boss-chart__score-value">
          <span className="boss-chart__score-current">{ currentScore.category_score }</span>
          <span> / </span>
          <span className="boss-chart__score-total">{ currentScore.total_score }</span>
        </p>
      </div>
    );
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
            <div className="boss-board__chart">
              <div id="cleanliness-score" className="boss-chart-score" data-id="cleanliness-score" data-current="55" data-total="100" data-size="250">
                <div className="boss-chart">
                  <div className="boss-chart__inner">
                    <svg className="boss-chart__graph" width="250" height="250">
                      <path d="M6.8886382452038615e-15,-112.5A112.5,112.5 0 0,1 72.31360608973569,86.17999985088501L58.65436938389673,69.90155543460673A91.25,91.25 0 0,0 5.587451021109799e-15,-91.25Z" transform="translate(125, 147.05882352941177) rotate(220)"></path>
                      <path d="M87.29859364832147,84.14581419788655A121.25,121.25 0 0,1 12.561425499546989,120.59756668117036L8.417450077016024,80.81280241521725A81.25,81.25 0 0,0 58.49905759939068,56.38637033878995Z" transform="translate(125, 147.05882352941177) rotate(220)"></path>
                      <path d="M72.31360608973569,86.17999985088501A112.5,112.5 0 0,1 -110.79087221387341,-19.53541998752963L-89.86370746236399,-15.845396212107365A91.25,91.25 0 0,0 58.65436938389673,69.90155543460673Z" transform="translate(125, 147.05882352941177) rotate(220)"></path>
                      <path d="M87.29859364832147,84.14581419788655A121.25,121.25 0 0,1 12.561425499546989,120.59756668117036L8.417450077016024,80.81280241521725A81.25,81.25 0 0,0 58.49905759939068,56.38637033878995Z" transform="translate(125, 147.05882352941177) rotate(220)"></path>
                      <g className="boss-chart__info">
                        <text className="boss-chart__info-number" x="125" y="147.05882352941177">55</text>
                        <text className="boss-chart__info-label" x="125" y="175.05882352941177">Score</text>
                      </g>
                    </svg>
                  </div>

                  { this.renderScore() }
                </div>
              </div>
            </div>

            <AnswersTable { ...this.props } />
          </div>
        </div>
      </section>
    )
  }
}
