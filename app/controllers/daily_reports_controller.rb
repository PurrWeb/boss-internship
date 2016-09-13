class DailyReportsController < ApplicationController
  def index
    authorize!(:view, :daily_reports)

    if date_from_params.present? && venue_from_params.present?
      date = date_from_params
      venue = venue_from_params

      query = DailyReportsIndexStaffMemberQuery.new(
        date: date,
        venue: venue
      )

      staff_members = query.all

      ActiveRecord::Associations::Preloader.new.preload(staff_members, [:name, :staff_type])

      total_rotaed_cost_cents = 0
      total_actual_cost_cents = 0
      total_overheads_cents = 0
      staff_members.each do |staff_member|
        total_overheads_cents   += staff_member.overhead_cost_cents
        total_rotaed_cost_cents += staff_member.rotaed_cost_cents
        total_actual_cost_cents += staff_member.actual_cost_cents
      end

      render locals: {
        accessible_venues: accessible_venues,
        venue: venue,
        date: date,
        total_overheads_cents: total_overheads_cents,
        total_rotaed_cost_cents: total_rotaed_cost_cents,
        total_actual_cost_cents: total_actual_cost_cents,
        staff_members: staff_members
      }
    else
      redirect_to(redirect_params)
    end
  end

  private
  def accessible_venues
    @accessible_venues ||= AccessibleVenuesQuery.new(current_user).all
  end

  def date_from_params
    if params[:date].present?
      UIRotaDate.parse(params[:date])
    end
  end

  def venue_from_params
    if params[:venue_id].present?
      accessible_venues.find_by(id: params[:venue_id])
    end
  end

  def redirect_params
    {
      date: UIRotaDate.format(date_from_params || RotaShiftDate.to_rota_date(Time.current) - 1.day),
      venue_id: (venue_from_params || accessible_venues.first).id
    }
  end
end
