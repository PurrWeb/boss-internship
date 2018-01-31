import React, { Component } from 'react';
import oFetch from 'o-fetch';
import AsyncButton from 'react-async-button';

class AccessoryRequestActions extends Component {
  state = {
    rejectPending: false,
    acceptPending: false,
    undoPending: false,
  };

  onReject = () => {
    this.setState({ rejectPending: true });
    return this.props
      .onRejectRequest()
      .then(() => this.setState({ rejectPending: false }));
  };

  onAccept = () => {
    this.setState({ acceptPending: true });
    return this.props
      .onAcceptRequest()
      .then(() => this.setState({ acceptPending: false }));
  };

  onUndo = () => {
    this.setState({ undoPending: true });
    return this.props
      .onUndoRequest()
      .then(() => this.setState({ undoPending: false }));
  };

  render() {
    const { status } = this.props;
    if (status === 'pending') {
      return (
        <div className="boss-table__actions">
          {!this.state.rejectPending && (
            <AsyncButton
              className="boss-button boss-button_type_small boss-button_role_success boss-table__action"
              text="Accept"
              pendingText="Accepting ..."
              onClick={this.onAccept}
            />
          )}
          {!this.state.acceptPending && (
            <AsyncButton
              className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
              text="Reject"
              pendingText="Rejecting ..."
              onClick={this.onReject}
            />
          )}
        </div>
      );
    }
    if (status === 'accepted') {
      return (
        <div>
          <p
            key="status"
            className="boss-table__text boss-table__text_role_success-status"
          >
            Accepted
          </p>
          <div key="actions" className="boss-table__actions">
            {!this.state.undoPending && (
              <AsyncButton
                className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
                text="Done"
                onClick={this.props.onDoneRequest}
              />
            )}
            <AsyncButton
              className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
              text="Undo"
              onClick={this.onUndo}
            />
          </div>
        </div>
      );
    }
    if (status === 'rejected') {
      return (
        <div>
          <p
            key="status"
            className="boss-table__text boss-table__text_role_alert-status"
          >
            Rejected
          </p>
          <div key="actions" className="boss-table__actions">
            {!this.state.undoPending && (
              <AsyncButton
                className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
                text="Done"
                onClick={() => this.props.onDoneRejectedRequest(requestId)}
              />
            )}
            <AsyncButton
              className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
              text="Undo"
              onClick={this.onUndo}
            />
          </div>,
        </div>
      );
    }
    return null;
  }
}

export default AccessoryRequestActions;
