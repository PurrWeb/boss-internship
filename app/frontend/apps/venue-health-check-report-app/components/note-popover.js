import React from 'react';
import classnames from 'classnames';

import ImageGallery from './image-gallery';

export default class NotePopover extends React.Component {
  static displayName = 'NotePopover';

  componentDidMount() {
    $('html').on('click', function(e) {
      if (e.target.closest('.boss-popover')) return;

      $('.boss-popover').fadeOut().removeClass('boss-popover_state_opened');
      $('body').removeClass('boss-body_state_inactive');
    });
  }

  renderTitle() {
    if (!this.props.currentAnswer.uploads.length) return '';

    return <h4 className="boss-popover__subtitle">Images</h4>;
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

          { this.renderTitle() }
          <ImageGallery { ...this.props } />
        </div>
      </div>
    )
  }
}
