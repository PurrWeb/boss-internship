import React, { Component } from 'react';
import oFetch from 'o-fetch';
import AsyncButton from 'react-async-button';

class AccessoryRequestActions extends Component {
  state = {
    currentStatusPending: false,
    currentStatus: this.props.status,
    requestPendind: false,
  };

  onReject = () => {
    this.setState({ currentStatus: 'rejected', currentStatusPending: true });
  };

  onAccept = () => {
    this.setState({ currentStatus: 'accepted', currentStatusPending: true });
  };

  onUndo = () => {
    this.setState({
      currentStatus: this.props.status,
      currentStatusPending: false,
    });
  };

  onDone = action => {
    this.setState(
      {
        currentStatusPending: false,
        requestPendind: true,
      },
      () => {
        action().then(resp =>
          this.setState({
            currentStatus: resp.data.status,
            requestPendind: false,
          }),
        );
      },
    );
  };

  renderDoneUndoButtons(doneAction) {
    return (
      <div key="actions" className="boss-table__actions">
        <button
          className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
          onClick={() => this.onDone(doneAction)}
        >
          Done
        </button>
        <button
          className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
          onClick={this.onUndo}
        >
          Undo
        </button>
      </div>
    );
  }

  render() {
    const { currentStatus } = this.state;
    if (currentStatus === 'pending') {
      return (
        <div className="boss-table__actions">
          <button
            className="boss-button boss-button_type_small boss-button_role_success boss-table__action"
            onClick={this.onAccept}
          >
            Accept
          </button>
          <button
            className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
            onClick={this.onReject}
          >
            Reject
          </button>
        </div>
      );
    }
    if (currentStatus === 'accepted') {
      return (
        <div>
          <p
            key="status"
            className="boss-table__text boss-table__text_role_success-status"
          >
            {this.state.requestPendind ? 'Accepting ...' : 'Accepted'}
          </p>
          <div key="actions" className="boss-table__actions">
            {this.state.currentStatusPending &&
              this.renderDoneUndoButtons(this.props.onAcceptRequest)}
          </div>
        </div>
      );
    }
    if (currentStatus === 'rejected') {
      return (
        <div>
          <p
            key="status"
            className="boss-table__text boss-table__text_role_alert-status"
          >
            {this.state.requestPendind ? 'Rejecting ...' : 'Rejected'}
          </p>
          <div key="actions" className="boss-table__actions">
            {this.state.currentStatusPending &&
              this.renderDoneUndoButtons(this.props.onRejectRequest)}
          </div>
        </div>
      );
    }
    return null;
  }
}

export default AccessoryRequestActions;
