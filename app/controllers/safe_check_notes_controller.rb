class SafeCheckNotesController < ApplicationController
  def index
    safe_check = SafeCheck.find(params.fetch(:safe_check_id))

    authorize! :manage, safe_check.venue

    safe_check_note = SafeCheckNote.new
    safe_check_notes = safe_check.notes.enabled

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

      safe_check_notes = safe_check.notes.enabled

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

  def destroy
    safe_check_note = SafeCheckNote.find(params[:id])

    authorize! :manage, safe_check_note.safe_check.venue

    if safe_check_note.disabled?
      flash[:error] = "Can't disable already disabled note"
    else
      safe_check_note.disable!(requester: current_user)
      flash[:success] = 'Note disabled successfully'
    end

    redirect_to(safe_check_path(safe_check_note.safe_check))
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
