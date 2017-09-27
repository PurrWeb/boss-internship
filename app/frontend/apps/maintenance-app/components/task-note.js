import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Modal from "react-modal"
import { Form, Control, Errors } from 'react-redux-form';
import { isEmpty } from 'validator';
import NoteForm from './note-form'

export default class TaskModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNoteCreate: false,
      noteButtonText: 'Add Notes'
    }
  }

  handleNoteToggle(e) {
    e.preventDefault();

    this.setState({ showNoteCreate: !this.state.showNoteCreate })

    if (!this.state.showNoteCreate) {
      this.setState({ noteButtonText: 'Cancel' });
    } else {
      this.setState({ noteButtonText: 'Add Note' });
    }
  }

  renderNotes() {
    return this.props.selectedMaintenanceTask.maintenanceTaskNotes.map((note) => {
      return(
        <div className="boss-message boss-message_role_overview" key={ note.id }>
          <div className="boss-message__inner">
            <p className="boss-message__text">{ note.note }</p>
          </div>

          <div className="boss-message__meta">
            <p className="boss-message__meta-text boss-message__meta-text_role_user">{ note.creatorUser.name }</p>
            <p className="boss-message__meta-text boss-message__meta-text_role_date">{ moment(note.createdAt).format('HH:mm ddd L') }</p>
          </div>
        </div>
      );
    });
  }

  handleButtonClick(e) {
    e.preventDefault();

    $(e.target).closest('.boss-overview__dropdown').each(function() {
      let dropdownAction = $(this).find('.boss-overview__dropdown-switch');
      let dropdownActionText = $(this).find('.boss-overview__dropdown-switch-text');
      let dropdownContent = $(this).find('.boss-overview__dropdown-content');
      let text = dropdownActionText.text();

      if (text === 'Show Notes' || text === 'Hide Notes') {
        dropdownActionText.text(text === 'Show Notes' ? 'Hide Notes' : 'Show Notes');
      } else if (text === 'Show Activity' || text === 'Hide Activity') {
        dropdownActionText.text(text === 'Show Activity' ? 'Hide Activity' : 'Show Activity');
      }

      dropdownAction.toggleClass('boss-overview__dropdown-switch_state_closed');
      dropdownContent.slideToggle().toggleClass('boss-overview__dropdown-content_state_closed');
    });
  }

  render() {
    let task = this.props.selectedMaintenanceTask;

    return(
      <div className="boss-overview__dropdown boss-overview__dropdown_active-mobile">
        <div className="boss-overview__dropdown-header">
          <button
            className="boss-overview__dropdown-switch boss-overview__dropdown-switch_role_notes boss-overview__dropdown-switch_state_closed"
            onClick={ this.handleButtonClick.bind(this) }
          >
            <span className="boss-overview__dropdown-switch-text">Show Notes</span>
          </button>
        </div>

        <div className={ `boss-overview__dropdown-content ${(this.state.showNoteCreate) ? '' : 'boss-overview__dropdown-content_state_closed'}` }>
          <div className="boss-overview__notes">
            <div className="boss-overview__notes-control">
              <p className="boss-overview__notes-label">
                <span>{ task.maintenanceTaskNotes.length }</span>
                <span> Notes</span>
              </p>

              <a
                href="#"
                className={ `boss-overview__notes-switch ${(this.state.showNoteCreate) ? '' : 'boss-overview__notes-switch_state_closed'}` }
                onClick={ this.handleNoteToggle.bind(this) }
              >
                { this.state.noteButtonText }
              </a>
            </div>

            <div className={ `boss-overview__notes-form ${(this.state.showNoteCreate) ? '' : 'boss-overview__notes-form_state_closed' }` }>
              <NoteForm { ...this.props } />
            </div>

            <div className="boss-overview__notes-messages">
              { this.renderNotes() }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
