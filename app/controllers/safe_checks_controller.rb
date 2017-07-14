class SafeChecksController < ApplicationController
  before_action :set_new_layout, only: [:index, :new, :create]

  def index
    if venue_from_params.present?
      venue = venue_from_params

      authorize! :manage, venue

      safe_checks = SafeCheck.
        where(venue: venue).
        order(created_at: :desc).
        paginate(
          page: params[:page],
          per_page: 20
        )

      render locals: {
        current_venue: venue,
        accessible_venues: accessible_venues,
        safe_checks: safe_checks
      }
    else
      redirect_to(safe_checks_path(redirect_params))
    end
  end

  def show
    safe_check = SafeCheck.find(params[:id])
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
      authorize! :manage, safe_check.venue

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
    safe_check = SafeCheck.new(safe_check_params)
    save_models = [safe_check]

    safe_check_note = SafeCheckNote.new(
      safe_check_note_params.
        merge(
          safe_check: safe_check,
          created_by: current_user,
          note_left_by_note: safe_check.checked_by_note
        )
    )

    if safe_check_note_params["note_text"].strip.present?
      save_models << safe_check_note
    end

    authorize! :manage, safe_check.venue

    success = false

    ActiveRecord::Base.transaction do
      success = save_models.map(&:save).all?
      raise ActiveRecord::Rollback unless success
    end

    if success
      flash[:success] = "Safe check created successfully"
      redirect_to(
        safe_checks_path(venue_id: safe_check.venue.id)
      )
    else
      render 'new', locals: {
        current_venue: find_accessible_venue(params['safe_check']['venue_id']),
        accessible_venues: accessible_venues,
        safe_check: safe_check,
        safe_check_note: safe_check_note
      }
    end
  end

  private
  def accessible_venues
    AccessibleVenuesQuery.
      new(current_user).
      all
  end

  def safe_check_note_params
    params.
      require("safe_check").
      require("safe_check_note").
      permit([
        :note_text
      ])
  end

  def redirect_params
    venue = venue_from_params || current_user.default_venue
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

  def safe_check_params
    venue = find_accessible_venue!(_safe_check_params["venue_id"])

    params.
      require(:safe_check).
      permit([:checked_by_note]).
      merge(
        venue: venue,
        creator: current_user
      ).
      merge(pound_params).
      merge(cent_params).
      merge(
        float_params(venue)
      ).
      permit!
  end

  def _safe_check_params
    params["safe_check"] || {}
  end

  def float_params(venue)
    {
      till_float_cents: venue.till_float_cents,
      safe_float_cents: venue.safe_float_cents
    }
  end

  def pound_params
    result = {}
    SafeCheck::POUND_FIELDS.each do |field|
      parsed_value = nil
      unparsed_value = _safe_check_params.fetch(field.to_s)
      begin
        parsed_value = Float(unparsed_value).to_int_if_whole
      rescue ArgumentError, TypeError
      end

      if parsed_value.present?
        result[field] = parsed_value
      else
        result[field] = unparsed_value
      end
    end
    result
  end

  def cent_params
    result = {}
    (SafeCheck::CENTS_FIELDS - [:safe_float_cents, :total_float_cents, :till_float_cents]).each do |field|
      parsed_value = nil
      unparsed_value = _safe_check_params.fetch(field.to_s)
      begin
        parsed_value = Float(unparsed_value)
      rescue ArgumentError, TypeError
      end

      if parsed_value.present?
        result[field] = parsed_value * 100.0
      else
        result[field] = unparsed_value
      end
    end
    result
  end
end
