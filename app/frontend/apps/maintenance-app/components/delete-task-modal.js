import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Select from 'react-select';

import Modal from "react-modal";
import TaskNote from './task-note';
import ImageGallery from './image-gallery'

export default class DeleteTaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saveMode: false,
      deleteText: 'Delete'
    }
  }

  onClose() {
    this.props.setFrontendState({ showDeleteModal: false });
    this.props.setCurrentMaintenanceTask(null);
  }

  confirmDelete() {
    this.setState({ deleteText: 'Deleting..' });

    this.props.deleteMaintenanceTask(this.props.selectedMaintenanceTask).then(() => {
      this.props.queryMaintenanceTasks();
      this.setState({ deleteText: 'Deleted' });
      this.onClose();
    });
  }

  render() {
    let task = this.props.selectedMaintenanceTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showDeleteModal }
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
            <button type="button" className="boss-button boss-button_role_cancel" onClick={ this.confirmDelete.bind(this) }>{ this.state.deleteText }</button>
          </div>
        </div>
      </Modal>
    )
  }
}
