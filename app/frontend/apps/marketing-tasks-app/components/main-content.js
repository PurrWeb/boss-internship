import React from 'react';
import classnames from 'classnames';

import GeneralTasks from './general-tasks/index';
import MusicTasks from './music-tasks/index';
import SportsTasks from './sports-tasks/index';
import ArtworkTasks from './artwork-tasks/index';

import NotesModal from './shared/notes-modal';
import TimelineModal from './shared/timeline-modal';
import AssignedToModal from './shared/assigned-to-modal';
import TaskFormModal from './shared/task-form-modal';
import DeleteTaskModal from './shared/delete-task-modal';

export default class MainContent extends React.Component {
  renderTaskNotesModal() {
    if (this.props.frontend.showNotesModal) {
      return <NotesModal { ...this.props } />
    }
  }

  renderTimelineModal() {
    if (this.props.frontend.showTimelineModal) {
      return <TimelineModal { ...this.props } />
    }
  }

  renderAssignedToModal() {
    if (this.props.frontend.showAssignedToModal) {
      return <AssignedToModal { ...this.props } />
    }
  }

  renderTaskModal() {
    if (this.props.frontend.showCreateTaskModal) {
      return <TaskFormModal { ...this.props } />
    }
  }

  renderEditTaskModal() {
    if (this.props.frontend.showEditTaskModal) {
      return <TaskFormModal { ...this.props } />
    }
  }

  renderDeleteTaskModal() {
    if (this.props.frontend.showDeleteTaskModal) {
      return <DeleteTaskModal { ...this.props } />
    }
  }

  render() {
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          <GeneralTasks { ...this.props } />
          <ArtworkTasks { ...this.props } />
          <MusicTasks { ...this.props } />
          <SportsTasks { ...this.props } />

          { this.renderTaskNotesModal() }
          { this.renderTimelineModal() }
          { this.renderAssignedToModal() }
          { this.renderTaskModal() }
          { this.renderEditTaskModal() }
          { this.renderDeleteTaskModal() }
        </div>
      </div>
    )
  }
}
