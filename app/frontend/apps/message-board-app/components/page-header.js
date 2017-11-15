import React from 'react';
import classnames from 'classnames';

export default class PageHeader extends React.Component {
  handleNewMessage(e) {
    e.preventDefault();

    this.props.setFrontendState({
      indexPage: false,
      createPage: true,
      updatePage: false,
    });
  }

  handleCancel(e) {
    e.preventDefault();

    this.props.setFrontendState({
      indexPage: true,
      createPage: false,
      updatePage: false,
    });
  }

  renderButtonActions() {
    let frontend = this.props.frontend;

    if (frontend.indexPage) {
      return (
        <div className="boss-page-dashboard__buttons-group">
          <a className="boss-button boss-button_role_add boss-page-dashboard__button" onClick={ this.handleNewMessage.bind(this) }>Add New Message</a>
        </div>
      );
    } else if (frontend.createPage || frontend.updatePage) {
      return (
        <div className="boss-page-dashboard__buttons-group">
          <button type="button" className="boss-button boss-button_role_cancel boss-page-dashboard__button" onClick={ this.handleCancel.bind(this) }>Cancel</button>
        </div>
      );
    }
  }

  renderTitle() {
    let frontend = this.props.frontend;

    if (frontend.indexPage) {
      return (
        <h1 className="boss-page-dashboard__title">Message Board</h1>
      );
    } else if (frontend.createPage) {
      return (
        <h1 className="boss-page-dashboard__title">Add New Message Board</h1>
      );
    } else if (frontend.updatePage) {
      return (
        <h1 className="boss-page-dashboard__title">Edit Message Board</h1>
      );
    }
  }

  render() {
    return(
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              { this.renderTitle() }

              { this.renderButtonActions() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
