import React from 'react';
import classnames from 'classnames';
import Modal from "react-modal";

export default class DeleteTaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleteMode: false,
      deleteText: 'Delete'
    }
  }

  onClose() {
    this.props.setFrontendState({ showDeleteTaskModal: false });
    this.props.setSelectedMarketingTask(null);
  }

  confirmDelete() {
    this.setState({ deleteText: 'Deleting..', deleteMode: true });

    this.props.deleteMarketingTask(this.props.selectedMarketingTask).then(() => {
      this.props.queryFilteredMarketingTasks(this.props.filter);
      this.setState({ deleteText: 'Deleted' });
      this.onClose();
    });
  }

  render() {
    let task = this.props.selectedMarketingTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showDeleteTaskModal }
        className={{
          afterOpen: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_danger',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close" onClick={ this.onClose.bind(this) }></button>
        <div className="boss-modal-window__header">WARNING !!!</div>

        <div className="boss-modal-window__content">
          <div className="boss-modal-window__message-block">
            <span className="boss-modal-window__message-text">Are You Sure?</span>
          </div>

          <div className="boss-modal-window__actions">
            <button
              type="button"
              className="boss-button boss-button_role_cancel"
              onClick={ this.confirmDelete.bind(this) }
              disabled={ this.state.deleteMode }
            >{ this.state.deleteText }</button>
          </div>
        </div>
      </Modal>
    )
  }
}
