import React, { Component } from 'react';
import oFetch from 'o-fetch';

class AccessoryRequestActions extends Component {
  state = {
    currentStatusPending: false,
    currentStatus: this.props.status,
    requestPendind: false,
  };

  onReject = () => {
    this.setState({ currentStatus: 'rejected', requestPendind: true });
    this.props.onRejectRequest();
  };

  onAccept = () => {
    this.setState({
      currentStatus: 'accepted',
      currentStatusPending: true,
      requestPendind: true,
    });
    this.props.onAcceptRequest().then(resp => {
      this.setState({ currentStatusPending: false, requestPendind: false });
    });
  };

  onUndo = () => {
    this.setState({
      currentStatus: 'undo',
      requestPendind: true,
    });
    this.props.onUndoRequest().then(resp => {
      this.setState({
        currentStatus: resp.data.status,
        requestPendind: false,
      });
    });
  };

  onComplete = () => {
    this.setState({
      currentStatus: 'completed',
      requestPendind: true,
    });
    this.props.onCompleteRequest().then(resp => {
      if (resp === 'cancel') {
        this.setState({ currentStatus: 'accepted', requestPendind: false });
      }
    });
  };

  renderDoneUndoButtons(canComplete, canUndo) {
    return (
      <div key="actions" className="boss-table__actions">
        {canComplete && (
          <button
            className="boss-button boss-button_type_extra-small boss-button_role_confirm-light boss-table__action"
            onClick={this.onComplete}
          >
            Complete
          </button>
        )}
        {canUndo && (
          <button
            className="boss-button boss-button_type_extra-small boss-button_role_cancel-light boss-table__action"
            onClick={this.onUndo}
          >
            Undo
          </button>
        )}
      </div>
    );
  }

  render() {
    const { currentStatus, requestPendind } = this.state;
    const permissions = oFetch(this.props, 'permissions');
    const [canAccept, canReject, canComplete, canUndo] = oFetch(
      permissions,
      'canAccept',
      'canReject',
      'canComplete',
      'canUndo',
    );
    if (currentStatus === 'undo') {
      return (
        <div>
          <p key="status" className="boss-table__text boss-table__text_role_success-status">
            {requestPendind ? 'Undoing ...' : ''}
          </p>
        </div>
      );
    }
    if (currentStatus === 'completed') {
      return (
        <div>
          <p key="status" className="boss-table__text boss-table__text_role_success-status">
            {requestPendind ? 'Processing ...' : ''}
          </p>
        </div>
      );
    }
    if (currentStatus === 'pending') {
      return (
        <div className="boss-table__actions">
          {canAccept && (
            <button
              className="boss-button boss-button_type_small boss-button_role_success boss-table__action"
              onClick={this.onAccept}
            >
              Accept
            </button>
          )}
          {canReject && (
            <button
              className="boss-button boss-button_type_small boss-button_role_cancel boss-table__action"
              onClick={this.onReject}
            >
              Reject
            </button>
          )}
        </div>
      );
    }
    if (currentStatus === 'accepted') {
      return (
        <div>
          <p key="status" className="boss-table__text boss-table__text_role_success-status">
            {requestPendind ? 'Accepting ...' : 'Accepted'}
          </p>
          {!requestPendind && (
            <div key="actions" className="boss-table__actions">
              {this.renderDoneUndoButtons(canComplete, canUndo)}
            </div>
          )}
        </div>
      );
    }
    if (currentStatus === 'rejected') {
      return (
        <div>
          <p key="status" className="boss-table__text boss-table__text_role_alert-status">
            {requestPendind ? 'Rejecting ...' : ''}
          </p>
        </div>
      );
    }
    return null;
  }
}

export default AccessoryRequestActions;
