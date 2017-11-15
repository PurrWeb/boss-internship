import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import constants from '../constants';
import Pagination from './pagination';
import MobileView from './mobile-view';

export default class IndexPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      disabling: false,
      restoring: false,
    }
  }

  renderTableHeaders() {
    return constants.TABLE_COLUMNS.map((column) => {
      return <div className="boss-table__cell boss-table__cell_role_header" key={column + Math.random()}>{ column }</div>;
    });
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

  valueForColumn(message, column) {
    let value;

    switch(column) {
      case 'Dates': return moment(message.publishedTime).format("DD-MM-YYYY");
      case 'Created By': return message.createdByUserName;
      case 'Title': return message.title;
    }
  }

  handleClick(message, e) {
    $('[data-preview-id="'+ message.id +'"]').slideToggle().toggleClass("boss-table__dropdown_state_closed");
  }

  handleDisableButton(message, e) {
    this.setState({ disabling: true });
    this.props.disableDasboardMessageRequest(message).then((response) => { this.setState({ disabling: false }); });
  }

  handleRestoreButton(message, e) {
    this.setState({ restoring: true });
    this.props.restoreDasboardMessageRequest(message).then((response) => { this.setState({ restoring: false }); });
  }

  renderRowCells(message) {
    let disabled = message.status == 'disabled';
    let disabledClass = (disabled) ? 'boss-button_role_disabled-sb' : 'boss-button_role_enabled-sb'

    return constants.TABLE_COLUMNS.map((column) => {
      switch (column) {
      case 'Dates':
      case 'Created By':
      case 'Title':
        return (
          <div className="boss-table__cell" key={column + Math.random()}>
            <div className="boss-table__info">
              <p className="boss-table__label">{ column }</p>
              <p className="boss-table__text boss-table__text_role_action" onClick={ this.handleClick.bind(this, message) }>{ this.valueForColumn(message, column) }</p>
            </div>
          </div>
        );

      case 'Status':
        return (
          <div className="boss-table__cell" key={column + Math.random()}>
            <div className="boss-table__info">
              <p className="boss-table__label">{ column }</p>

              <div className="boss-table__actions">
                <button
                  type="button"
                  className={ `boss-button boss-button_type_small ${disabledClass} boss-button_type_no-behavior` }
                >
                  { message.status.toUpperCase() }
                </button>
              </div>
            </div>
          </div>
        );

      case 'Action':
        return (
          <div className="boss-table__cell" key={column + Math.random()}>
            <div className="boss-table__info">
              <p className="boss-table__label">Action</p>
              <div className="boss-table__actions">
                <button type="button" className="boss-button boss-button_type_small boss-button_role_edit boss-table__action" onClick={ this.handleEditClick.bind(this, message) } >Edit</button>

                { this.getActionForState(message, disabled) }
              </div>
            </div>
          </div>
        );
      }
    });
  }

  getActionForState(message, disabled) {
    if (disabled) {
      return (
        <button
          type="button"
          className="boss-button boss-button_type_small boss-button_role_success boss-table__action"
          onClick={ this.handleRestoreButton.bind(this, message) }
          disabled={ this.state.restoring }>
            Restore
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
          onClick={ this.handleDisableButton.bind(this, message) }
          disabled={ this.state.disabling }>
            Disable
        </button>
      );
    }
  }

  renderTableRows() {
    let disabled, disabledClass;

    return this.props.messages.map((message) => {
      disabled = message.status == 'disabled';
      disabledClass = (disabled) ? 'boss-table__row_state_alert' : ''

      return (
        <span key={ message.id }>
          <div className={ `boss-table__row ${disabledClass}` } key={ message.id }>
            { this.renderRowCells(message) }
          </div>

          <div className="boss-table__dropdown boss-table__dropdown_state_closed" data-preview-id={ message.id }>
            <div className="boss-message boss-message_role_dashboard boss-message_role_preview">
              <div className="boss-message__ribbon-container">
                <p className="boss-message__ribbon">Preview</p>
              </div>

              <h2 className="boss-message__title boss-message__title_accent">{ message.title }</h2>

              <div className="boss-message__content" dangerouslySetInnerHTML={{ __html: message.message }}>
              </div>

              <div className="boss-message__meta">
                <div className="boss-message__meta-group">
                  <p className="boss-message__meta-text">( Created { moment(message.createdAt).format("h:mm ddd L") } )</p>
                </div>
              </div>
            </div>
          </div>
        </span>
      );
    });
  }

  render() {
    return(
      <div className="boss-page-main__inner boss-page-main__inner_opaque boss-page-main__inner_space_large">
        <div className="boss-table boss-table_page_message-board">
          <div className="boss-table__row boss-table__row_role_header">
            { this.renderTableHeaders() }
          </div>

          <div className="boss-table__group">
            { this.renderTableRows() }
          </div>
        </div>

        <MobileView { ...this.props } />
      </div>
    );
  }
}
