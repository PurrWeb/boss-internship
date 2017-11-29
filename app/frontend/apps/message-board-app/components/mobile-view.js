import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

export default class MobileView extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      disabling: false,
      restoring: false,
    }
  }

  handleClick(message, e) {
    $('[data-preview-id="'+ message.id +'"]').slideToggle().toggleClass("boss-check__dropdown_state_closed");
  }

  handleEditClick(message, e) {
    e.preventDefault();

    this.props.setSelectedMessage(message);

    this.props.setFrontendState({
      indexPage: false,
      createPage: false,
      updatePage: true,
    });
  }

  handleDisableButton(message, e) {
    this.setState({ disabling: true });
    this.props.disableDasboardMessageRequest(message).then((response) => { this.setState({ disabling: false }); });
  }

  handleRestoreButton(message, e) {
    this.setState({ restoring: true });
    this.props.restoreDasboardMessageRequest(message).then((response) => { this.setState({ restoring: false }); });
  }

  renderRows() {
    return this.props.messages.map((message) => {
      return (
        <div className="boss-check boss-check_role_panel boss-check_page_message-board" key={ message.id }>
          <div className="boss-check__row">
            <div className="boss-check__cell boss-check__cell_size_half">
              <p className="boss-check__text boss-check__text_role_date boss-check__text_role_primary boss-check__text_role_action">{ moment(message.publishedAt).format("ddd L") }</p>
            </div>

            <div className="boss-check__cell boss-check__cell_size_half">
              <p className="boss-check__text boss-check__text_role_user boss-check__text_role_primary boss-check__text_role_action">{ message.createdByUserName }</p>
            </div>
          </div>

          <div className="boss-check__row">
            <div className="boss-check__cell">
              <div className="boss-check__box boss-check__box_role_action" onClick={ this.handleClick.bind(this, message) }>
                <p className="boss-check__title boss-check__title_role_message">{ message.title }</p>
                <button type="button" className="boss-button boss-button_type_small boss-button_role_enabled-sb boss-button_type_no-behavior boss-check__label">LIVE</button>
              </div>
            </div>
          </div>

          <div className="boss-check__dropdown boss-check__dropdown_state_closed" data-preview-id={ message.id }>
            <div className="boss-message boss-message_role_dashboard boss-message_role_preview">
              <div className="boss-message__ribbon-container">
                <p className="boss-message__ribbon">Preview</p>
              </div>

              <h2 className="boss-message__title boss-message__title_accent">{ message.title }</h2>

              <div className="boss-message__content" dangerouslySetInnerHTML={{ __html: message.message }}>
              </div>

              <div className="boss-message__meta">
                <div className="boss-message__meta-group">
                  <p className="boss-message__meta-text">( { moment(message.createdAt).format("h:mm ddd L") } )</p>
                </div>
              </div>
            </div>
          </div>

          <div className="boss-check__row">
            <div className="boss-check__cell boss-check__cell_no-border boss-check__cell_size_half">
              <button type="button" className="boss-button boss-button_adjust_full-mobile boss-button_role_edit" onClick={ this.handleEditClick.bind(this, message) }>Edit</button>
            </div>

            <div className="boss-check__cell boss-check__cell_size_half">
              <button type="button" className="boss-button boss-button_adjust_full-mobile boss-button_role_cancel">Disable</button>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return(
      <span>
        { this.renderRows() }
      </span>
    );
  }
}
