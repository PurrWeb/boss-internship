class SafeChecksController < ApplicationController
  before_action :set_new_layout, only: [:index, :new, :create]

  def index
    if venue_from_params.present?
      venue = venue_from_params

      authorize! :view, SafeChecksPage.new(venue: venue)

      safe_checks = SafeCheck.
        where(venue: venue).
        order(created_at: :desc).
        includes(:enabled_notes).
        paginate(
          page: params[:page],
          per_page: 20
        )

      render locals: {
        current_venue: venue,
        accessible_venues: accessible_venues,
        safe_checks: safe_checks,
        date_format: '%I:%M %a %m/%d/%Y'
      }
    else
      redirect_to(safe_checks_path(redirect_params))
    end
  end

  def show
    safe_check = SafeCheck.find(params[:id])
    authorize!(:view, safe_check)

    safe_check_notes = safe_check.notes

    render locals: {
      safe_check: safe_check,
      safe_check_notes: safe_check_notes
    }
  end

  def new
    if venue_from_params.present?
      venue = venue_from_params
      safe_check = SafeCheck.new(
        venue: venue,
        till_float_cents: venue.till_float_cents,
        safe_float_cents: venue.safe_float_cents
      )
      authorize! :create, SafeChecksPage.new(venue: venue)

      safe_check_note = SafeCheckNote.new

      render locals: {
        current_venue: venue,
        accessible_venues: accessible_venues,
        safe_check: safe_check,
        safe_check_note: safe_check_note
      }
    else
      redirect_to(new_safe_check_path(redirect_params))
    end
  end

  def create
    form = CreateSafeCheckForm.new(
      params: params,
      accessible_venues: accessible_venues,
    )
    authorize! :view, SafeChecksPage.new(venue: form.venue)

    result = CreateSafeCheck.new(
      total_out_to_order_cents: form.total_out_to_order_cents,
      safe_check_params: form.safe_check_params,
      safe_check_note_params: form.safe_check_note_params,
      requester: current_user,
    ).call

    if result.success?
      flash[:success] = "Safe check created successfully"
      redirect_to(
        safe_checks_path(venue_id: form.venue.id)
      )
    else
      form.perpare_model(result.safe_check)

      render 'new', locals: {
        current_venue: form.venue,
        accessible_venues: accessible_venues,
        safe_check: result.safe_check,
        safe_check_note: result.safe_check_note
      }
    end
  end

  private
  def accessible_venues
    AccessibleVenuesQuery.
      new(current_user).
      all
  end

  def redirect_params
    venue = venue_from_params || current_venue
    {
      venue_id: venue.andand.id
    }
  end

  def venue_from_params
    find_accessible_venue(params["venue_id"])
  end

  def find_accessible_venue(id_param)
    accessible_venues.
      find_by(id: id_param)
  end

  def find_accessible_venue!(id_param)
    accessible_venues.
      find_by!(id: id_param)
  end


  def _safe_check_params
    params["safe_check"] || {}
  end

end
