import React from 'react';
import classnames from 'classnames';

export default class NotePopover extends React.Component {
  static displayName = 'NotePopover';

  componentDidMount() {
    $('html').on('click', function(e) {
      if (e.target.closest('.boss-popover')) return;

      $('.boss-popover').fadeOut().removeClass('boss-popover_state_opened');
      $('body').removeClass('boss-body_state_inactive');
    });
  }

  render() {
    if (!this.props.currentAnswer.note) {
      return <div></div>;
    }

    return (
      <div className="boss-popover boss-popover_context_results-end" data-popover={ this.props.currentAnswer.questionnaire_question_id }>
        <header className="boss-popover__header">
          <i className="boss-popover__icon"></i>
          <h3 className="boss-popover__title">Notes</h3>
        </header>

        <div className="boss-popover__content">
          <p className="boss-popover__text">
            { this.props.currentAnswer.note }
          </p>
          <h4 className="boss-popover__subtitle">Images</h4>

          <div className="gallery">
            <div className="boss-popover__image">
              <img src="https://s-media-cache-ak0.pinimg.com/736x/42/ac/6a/42ac6ac364bd911e872d6f1e18ec7e42.jpg" alt="" />
            </div>

            <div className="boss-popover__image">
              <img src="https://st.hzcdn.com/fimgs/cf3111130426c707_1308-w500-h400-b0-p0--traditional-bathroom.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
