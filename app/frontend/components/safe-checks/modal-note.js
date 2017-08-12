import React from 'react'
import Select from 'react-select';
import moment from 'moment'

export default class ModalNote extends React.Component {
  toggleNoteForm(event) {
    event.preventDefault();

    let $target = $(event.target);

    $target.toggleClass('boss-stats__note-switch_state_closed');

    if ($target.hasClass('boss-stats__note-switch_state_closed')) {
      $target.html('Add Note');
    } else {
      $target.html('Cancel');
    }

    $target.closest('.boss-stats__note').find('.boss-stats__note-form').toggleClass('boss-stats__note-form_state_closed');
  }

  renderNotes() {
    return this.props.notes.map(note => {
      return (
        <div className="boss-message boss-message_role_sc-details" key={note.id}>
          <p className="boss-message__text">{ note.note_text }</p>
          <div className="boss-message__meta">
            <p className="boss-message__meta-text boss-message__meta-text_role_user">{ note.note_left_by_note }</p>
            <p className="boss-message__meta-text boss-message__meta-text_role_date">
              { moment(note.created_at).format("H:mm ddd D MMMM YYYY") }
            </p>
          </div>
        </div>
      );
    });
  }

  render() {
    let AUTH_TOKEN = $('meta[name=csrf-token]').attr('content');

    return (
      <div className="boss-stats__note">
        <div className="boss-stats__note-control">
          <p className="boss-stats__note-meta">
            <span>{ this.props.notes.length } </span>
            <span>Notes</span>
          </p>

          <a href="#" className="boss-stats__note-switch boss-stats__note-switch_state_closed" onClick={ this.toggleNoteForm.bind(this) }>Add Notes</a>
        </div>

        <div className="boss-stats__note-form boss-stats__note-form_state_closed">
          <form role="form" className="boss-form" id={this.props.safe_check.id} action={"/safe_check_notes?safe_check_id=" + this.props.safe_check.id } acceptCharset="UTF-8" method="post">
            <input name="utf8" type="hidden" value="✓" />
            <input type="hidden" name="authenticity_token" value={ AUTH_TOKEN } />
            <div className="boss-form__field">
              <p className="boss-form__label"><span className="boss-form__label-text">Add notes</span></p>
              <textarea name="safe_check_note[note_text]" className="boss-form__textarea boss-form__textarea_type_transparent"></textarea>
            </div>

            <div className="boss-form__field">
              <label className="boss-form__label">
                <span className="boss-form__label-text boss-form__label-text_type_required">Created by</span>
                <input name="safe_check_note[note_left_by_note]" type="text" className="boss-form__input boss-form__input_type_transparent" required="" />
              </label>
            </div>

            <div className="boss-form__row boss-form__row_position_last">
              <div className="boss-form__field boss-form__field_justify_end">
                <button className="boss-button boss-button_role_add boss-form__submit boss-form__submit_adjust_single" type="submit">Add note</button>
              </div>
            </div>
          </form>
        </div>

        <div className="boss-stats__note-messages">
          { this.renderNotes() }
        </div>
      </div>
    );
  }
}
