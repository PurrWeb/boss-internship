import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Modal from "react-modal";
import ImageGallery from './image-gallery';
import NewTaskForm from './new-task-form';

export default class NewTaskModal extends React.Component {
  onClose() {
    this.props.setFrontendState({ showNewTaskModal: false });
    this.props.setCurrentMaintenanceTask(null);
    this.formReset();
  }

  formReset() {
    this.props.forms.forms.maintenanceTask.title.touched = false
    this.props.forms.forms.maintenanceTask.title.valid = true
    this.props.forms.forms.maintenanceTask.title.pristine = false

    this.props.forms.forms.maintenanceTask.description.touched = false
    this.props.forms.forms.maintenanceTask.description.valid = true
    this.props.forms.forms.maintenanceTask.description.pristine = false
  }

  renderTitle() {
    if (this.props.selectedMaintenanceTask) {
      return <div className="boss-modal-window__header">Edit Task</div>
    } else {
      return <div className="boss-modal-window__header">New Task</div>
    }
  }

  render() {
    return (
      <Modal
        isOpen={ this.props.frontend.showNewTaskModal }
        className={{
          afterOpen: 'boss-modal-window boss-modal-window_role_task-create',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close-inner" onClick={ this.onClose.bind(this) }></button>
        <div className="boss-modal-window__header">New Task</div>

        <div className="boss-modal-window__content">
          <div className="boss-modal-window__form">
            <NewTaskForm { ...this.props } />
          </div>
        </div>
      </Modal>
    )
  }
}
