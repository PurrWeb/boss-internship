class StaffMemberShiftsIndexQuery
  def initialize(
    venue_id_from_filter:,
    venue_type_from_filter:,
    start_date_from_filter:,
    end_date_from_filter:,
    staff_member:
  )
    @venue_id_from_filter = venue_id_from_filter
    @venue_type_from_filter = venue_type_from_filter
    @start_date_from_filter = start_date_from_filter
    @end_date_from_filter = end_date_from_filter
    @staff_member = staff_member
  end

  def all
    result = if normal_venue_type?
      default_data.merge(normal_venue_data)
    elsif security_venue_type?
      default_data.merge(security_venue_data)
    else
      normal_venue_data.merge(security_venue_data)
    end
  end

  private
  attr_reader :venue_id_from_filter, :venue_type_from_filter, :start_date_from_filter, :end_date_from_filter, :staff_member

  def normal_venue
    Venue.find_by(id: venue_id_from_filter) if normal_venue_type?
  end

  def security_venue
    SecurityVenue.find_by(id: venue_id_from_filter) if security_venue_type?
  end

  def security_venue_type?
    venue_id_from_filter.present? &&
      venue_type_from_filter.present? &&
        venue_type_from_filter == SecurityVenue::VENUE_TYPE
  end

  def normal_venue_type?
    venue_id_from_filter.present? &&
      venue_type_from_filter.present? &&
        venue_type_from_filter == Venue::VENUE_TYPE
  end

  def normal_venue_data
    clock_in_days = if normal_venue.present?
      ClockInDay.where({staff_member: staff_member, venue: normal_venue})
    else
      ClockInDay.where({staff_member: staff_member})
    end

    clock_in_days_by_range = InRangeQuery.new(
      relation: clock_in_days.includes([:staff_member, :venue]),
      start_value: start_date_from_filter,
      end_value: end_date_from_filter,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    rotas = if normal_venue.present?
      Rota.where(venue: normal_venue)
    else
      Rota.all
    end

    rotas_by_range = InRangeQuery.new(
      relation: rotas,
      start_value: RotaShiftDate.new(start_date_from_filter).start_time,
      end_value: RotaShiftDate.new(end_date_from_filter).end_time,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    rota_shifts = RotaShift.enabled.where(staff_member: staff_member, rota: rotas_by_range).includes([:rota])

    hours_acceptance_periods = HoursAcceptancePeriod
      .enabled
      .joins(:clock_in_day)
      .where(clock_in_day: clock_in_days_by_range)
      .includes([:accepted_by, :finance_report, :hours_acceptance_breaks_enabled, clock_in_day: [:venue, :staff_member]])

    hours_acceptance_breaks = HoursAcceptanceBreak
      .enabled
      .joins(:hours_acceptance_period)
      .merge(hours_acceptance_periods)

    {
      rota_shifts: rota_shifts,
      hours_acceptance_periods: hours_acceptance_periods,
      hours_acceptance_breaks: hours_acceptance_breaks,
    }
  end

  def security_venue_data
    security_venue_shifts = if security_venue.present?
      SecurityVenueShift.enabled.where(staff_member: staff_member, security_venue: security_venue)
    else
      SecurityVenueShift.enabled.where(staff_member: staff_member)
    end

    security_venue_shifts_by_range = InRangeQuery.new(
      relation: security_venue_shifts,
      start_value: RotaShiftDate.new(start_date_from_filter).start_time,
      end_value: RotaShiftDate.new(end_date_from_filter).end_time,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    {
      security_venue_shifts: security_venue_shifts_by_range
    }
  end

  def default_data
    {
      hours_acceptance_periods: [],
      hours_acceptance_breaks: [],
      rota_shifts: [],
      security_venue_shifts: [],
    }
  end
end
