class SafeCheckNotesController < ApplicationController
  # When the user submits the form, Rails looks for the authenticity_token,
  # compares it to the one stored in the session, and if they match the request is allowed to continue.
  # Create is now done via JS, so the token is no longer valid
  skip_before_action :verify_authenticity_token, only: [:create]

  def index
    safe_check = SafeCheck.find(params.fetch(:safe_check_id))

    authorize! :manage, safe_check.venue

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

    authorize! :manage, safe_check.venue

    safe_check_note = SafeCheckNote.new(
      safe_check_note_params.
      merge(
        safe_check: safe_check,
        created_by: current_user
      )
    )

    if safe_check_note.save
      flash[:success] = "Note Added Successfully"

      redirect_to safe_check_path(safe_check)
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
