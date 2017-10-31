import React from 'react';
import classnames from 'classnames';

import Answer from './answer';

export default class QuestionActions extends React.Component {
  static displayName = 'QuestionActions';

  answerProps() {
    let cardProps = {
      activateAnsweredState: this.props.activateAnsweredState
    }

    return (Object.assign(cardProps, this.props));
  }

  renderNote() {
    if (!this.props.displayNote) {
      return (
        <div className="boss-question__helpers">
          <a
            href="javascript:;"
            className="boss-question__helpers-link boss-question__helpers-link_role_add"
            onClick={ this.props.toggleDisplayNote }
          >
            Add note
          </a>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="boss-question__actions">
        <Answer { ...this.answerProps() } />

        { this.renderNote() }
      </div>
    )
  }
}
