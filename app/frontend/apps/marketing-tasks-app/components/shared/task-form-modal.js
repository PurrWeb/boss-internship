import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Select from 'react-select';
import Modal from "react-modal";
import safeMoment from '~/lib/safe-moment';

import CreateGeneralTask from '../general-tasks/create';
import EditGeneralTask from '../general-tasks/edit';
import CreateMusicTask from '../music-tasks/create';
import EditMusicTask from '../music-tasks/edit';
import CreateSportsTask from '../sports-tasks/create';
import EditSportsTask from '../sports-tasks/edit';
import CreateArtworkTask from '../artwork-tasks/create';
import EditArtworkTask from '../artwork-tasks/edit';

export default class TaskFormModal extends React.Component {
  onClose() {
    this.props.setFrontendState({ showCreateTaskModal: false, showEditTaskModal: false, taskType: null });
    this.props.setSelectedMarketingTask(null);
  }

  renderTaskForm() {
    let taskType = this.props.frontend.taskType;

    if (this.props.selectedMarketingTask) {
      if (taskType == 'general') {
        return <EditGeneralTask { ...this.props } />
      } else if (taskType == 'music') {
        return <EditMusicTask { ...this.props } />
      } else if (taskType == 'sports') {
        return <EditSportsTask { ...this.props } />
      } else if (taskType == 'artwork') {
        return <EditArtworkTask { ...this.props } />
      }
    }

    if (taskType == 'general') {
      return <CreateGeneralTask { ...this.props } />
    } else if (taskType == 'music') {
      return <CreateMusicTask { ...this.props } />
    } else if (taskType == 'sports') {
      return <CreateSportsTask { ...this.props } />
    } else if (taskType == 'artwork') {
      return <CreateArtworkTask { ...this.props } />
    }
  }

  renderFormTitle() {
    let taskType = this.props.frontend.taskType;

    if (this.props.selectedMarketingTask) {
      if (taskType == 'general') {
        return 'Edit General Task';
      } else if (taskType == 'music') {
        return 'Edit Music Task';
      } else if (taskType == 'sports') {
        return 'Edit Sports Task';
      } else if (taskType == 'artwork') {
        return 'Edit Artwork Task';
      }
    }

    if (taskType == 'general') {
      return 'Create General Task';
    } else if (taskType == 'music') {
      return 'Create Music Task';
    } else if (taskType == 'sports') {
      return 'Create Sports Task';
    } else if (taskType == 'artwork') {
      return 'Create Artwork Task';
    }
  }

  render() {
    let task = this.props.selectedMarketingTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showCreateTaskModal || this.props.frontend.showEditTaskModal }
        className={{
          afterOpen: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_task-edit',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close" onClick={ this.onClose.bind(this) }></button>

        <div className="boss-modal-window__header">
          { this.renderFormTitle() }
        </div>

        <div className="boss-modal-window__content">
          <div className="boss-modal-window__form">
            { this.renderTaskForm() }
          </div>
        </div>
      </Modal>
    )
  }
}
