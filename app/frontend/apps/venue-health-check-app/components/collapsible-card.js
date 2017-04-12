import React from 'react';
import classnames from 'classnames';

import QuestionCard from '../components/question-card';

export default class CollapsibleCard extends React.Component {
  static displayName = 'CollapsibleCard';

  constructor(props) {
    super(props);

    this.state = {
      opened: true
    };
  }

  handleClick(e) {
    let $content = $(e.target).closest('.boss-board').find('.boss-board__content');
    let classToToggle = 'boss-board__content_state_opened';

    this.setState({
      opened: !this.state.opened
    });

    $content.slideToggle().end().toggleClass(classToToggle);
  }

  renderQuestionsCards() {
    return this.props.categoryQuestions.map(question => {
      let cardProps = {
        currentQuestion: question
      }

      cardProps = Object.assign(cardProps, this.props);

      return(
        <QuestionCard { ...cardProps } key={ question.id } />
      )
    });
  }

  render() {
    let iconStateClass = (this.state.opened) ? 'boss-board__switch_state_opened' : '';

    return (
      <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header boss-board__header_status_passed">
          <h2 className="boss-board__title">
            { this.props.currentCategory.name }
          </h2>

          <div className="boss-board__button-group">
            <a
              className={ `boss-board__switch boss-board__switch_type_angle ${iconStateClass}` }
              href="#"
              onClick={ this.handleClick.bind(this) }
            ></a>
          </div>
        </header>

        <div className={ `boss-board__content boss-board__content_state_opened` }>
          <div className="boss-board__content-inner">
            <div className="boss-questionnaire">
              <ul className="boss-questionnaire__list">
                { this.renderQuestionsCards() }
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
