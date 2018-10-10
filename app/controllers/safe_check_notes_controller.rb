class SafeCheckNotesController < ApplicationController
  def index
    safe_check = SafeCheck.find(params.fetch(:safe_check_id))
    authorize! :view, SafeChecksPage.new(venue: safe_check.venue)

    safe_check_note = SafeCheckNote.new
    safe_check_notes = safe_check.notes

    render locals: {
      safe_check_note: safe_check_note,
      safe_check: safe_check,
      safe_check_notes: safe_check_notes
    }
  end

  def create
    safe_check = SafeCheck.find(params.fetch(:safe_check_id))
    authorize! :update, SafeChecksPage.new(venue: safe_check.venue)

    safe_check_note = SafeCheckNote.new(
      safe_check_note_params.
      merge(
        safe_check: safe_check,
        created_by: current_user
      )
    )

    if safe_check_note.save
      flash[:success] = "Note Added Successfully"

      redirect_to safe_checks_path(venue_id: safe_check.venue.id)
    else
      flash.now[:error] = "There was a problem saving this note"

      safe_check_notes = safe_check.notes

      render(
        'index',
        locals: {
          safe_check_note: safe_check_note,
          safe_check: safe_check,
          safe_check_notes: safe_check_notes
        }
      )
    end
  end

  private
  def safe_check_note_params
    params.
      require("safe_check_note").
      permit([
        :note_text,
        :note_left_by_note
      ])
  end

end
