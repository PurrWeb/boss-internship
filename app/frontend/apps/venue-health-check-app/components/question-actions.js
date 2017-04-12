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
    if (this.props.displayNote) {
      return (
        <a
          href="#"
          className="boss-question__helpers-link boss-question__helpers-link_role_cancel"
          onClick={ this.props.toggleDisplayNote }
        >
        Cancel
        </a>
      )
    } else {
      return (
        <a
          href="#"
          className="boss-question__helpers-link boss-question__helpers-link_role_add"
          onClick={ this.props.toggleDisplayNote }
        >
          Add note
        </a>
      )
    }
  }

  render() {
    return (
      <div className="boss-question__actions">
        <Answer { ...this.answerProps() } />

        <div className="boss-question__helpers">
          { this.renderNote() }
        </div>
      </div>
    )
  }
}
