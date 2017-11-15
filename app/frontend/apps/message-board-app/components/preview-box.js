import React from 'react';
import classnames from 'classnames';

export default class PreviewBox extends React.Component {
  render() {
    return(
      <div className="boss-message boss-message_role_dashboard boss-message_type_accent boss-message_context_board boss-message_role_preview">
        <div className="boss-message__ribbon-container">
          <p className="boss-message__ribbon">Preview</p>
        </div>

        <h2 id="message-title-preview" className="boss-message__title boss-message__title_accent"></h2>

        <div id="message-preview" className="boss-message__content"></div>

        <div className="boss-message__meta">
          <div className="boss-message__meta-group">
            <p className="boss-message__meta-text">( 09:30 Mon 11/14/2016 )</p>
          </div>
        </div>
      </div>
    );
  }
}
