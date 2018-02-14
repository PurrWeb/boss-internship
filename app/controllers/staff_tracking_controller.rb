class StaffTrackingController < ApplicationController
  def index
    authorize!(:view, :staff_tracking_page)

    if week_from_params.present?
      week = week_from_params
      accessible_venues = AccessibleVenuesQuery.new(current_user).all

      filtered_venues = if venue_from_params.present?
        Venue.where(id: venue_from_params.id)
      else
        accessible_venues
      end

      creation_events_unfiltered = StaffTrackingEvent.
        creation_event.
        joins(:staff_member).
        merge(
          StaffMember.
          joins(:master_venue).
          merge(filtered_venues)
        )

      creation_events = InRangeQuery.new(
        relation: creation_events_unfiltered,
        start_value: week.start_date,
        end_value: week.end_date,
        table_name: StaffTrackingEvent.table_name,
        start_column_name: 'at',
        end_column_name: 'at'
      ).all.
        includes(staff_member: [:name, :master_venue])

      deletion_events_unfiltered = StaffTrackingEvent.
        deletion_event.
        joins(:staff_member).
        merge(
          StaffMember.
          joins(:master_venue).
          merge(filtered_venues)
        )

      deletion_events = InRangeQuery.new(
        relation: deletion_events_unfiltered,
        start_value: week.start_date,
        end_value: week.end_date,
        table_name: StaffTrackingEvent.table_name,
        start_column_name: 'at',
        end_column_name: 'at'
      ).all.
        includes(staff_member: [:name, :master_venue])

      render locals: {
        venue: venue_from_params,
        week: week,
        accessible_venues: accessible_venues,
        creation_events: creation_events,
        deletion_events: deletion_events
        #created_staff_members: created_staff_members,
        #deleted_staff_members: deleted_staff_members
      }
    else
      redirect_to(staff_tracking_index_path(index_redirect_params))
    end
  end

  private
  def index_redirect_params
    week_start = (week_from_params || RotaWeek.new(RotaShiftDate.to_rota_date(Time.current))).start_date
    {
      venue_id: venue_from_params.andand.id,
      week_start: UIRotaDate.format(week_start),
    }
  end

  def venue_from_params
    Venue.find_by(id: params[:venue_id])
  end

  def week_from_params
    if params[:week_start].present?
      RotaWeek.new(UIRotaDate.parse(params[:week_start]))
    end
  end

  def staff_member_order(relation)
    relation.
      joins(:master_venue).
      joins(:name).
      order("LOWER(`venues`.name), LOWER(CONCAT(`names`.first_name, `names`.surname))")
  end
end
