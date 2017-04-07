import React from 'react';
import classnames from 'classnames';

import Answer from './answer';

export default class QuestionActions extends React.Component {
  static displayName = 'QuestionActions';

  render() {
    return (
      <div className="boss-question__actions">
        <Answer { ...this.props } />

        <div className="boss-question__helpers">
          <a href="#" className="boss-question__helpers-link boss-question__helpers-link_role_edit boss-question__helpers-link_state_hidden">Edit</a>
          <a href="#" className="boss-question__helpers-link boss-question__helpers-link_role_add">Add note</a>
          <a href="#" className="boss-question__helpers-link boss-question__helpers-link_role_cancel boss-question__helpers-link_state_hidden">Cancel</a>
        </div>
      </div>
    )
  }
}
