import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Select from 'react-select';
import Modal from "react-modal";
import safeMoment from '~/lib/safe-moment';

import NoteForm from './note-form';

export default class NotesModal extends React.Component {
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
    if (!this.props.selectedMarketingTask.marketingTaskNotes.length) {
      return (
        <p className="boss-overview__notes-placeholder">No messages to display</p>
      );
    }

    return this.props.selectedMarketingTask.marketingTaskNotes.map((note) => {
      return(
        <div className="boss-message boss-message_role_overview" key={ note.id }>
          <div className="boss-message__inner">
            <p className="boss-message__text">{ note.note }</p>
          </div>

          <div className="boss-message__meta">
            <p className="boss-message__meta-text boss-message__meta-text_role_user">{ note.creatorUser.name }</p>
            <p className="boss-message__meta-text boss-message__meta-text_role_date">
              { safeMoment.uiDateParse(new Date(note.createdAt)).format('HH:mm ddd L') }
            </p>
          </div>
        </div>
      );
    });
  }

  onClose() {
    this.props.setFrontendState({ showNotesModal: false });
    this.props.setSelectedMarketingTask(null);
  }

  render() {
    let task = this.props.selectedMarketingTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showNotesModal }
        className={{
          afterOpen: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_task-overview',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close" onClick={ this.onClose.bind(this) }></button>

        <div className="boss-modal-window__header">Task Notes</div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <div className="boss-overview__dropdown boss-overview__dropdown_active-mobile">
                <div className="boss-overview__notes">
                  <div className="boss-overview__notes-control">
                    <p className="boss-overview__notes-label">
                      <span>{ this.props.selectedMarketingTask.marketingTaskNotes.length } </span>
                      <span>Notes</span>
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
          </div>
        </div>
      </Modal>
    )
  }
}
