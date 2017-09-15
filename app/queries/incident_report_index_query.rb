class IncidentReportIndexQuery
  def initialize(venue:, start_date:, end_date:, created_by:)
    @venue = venue
    @start_date = start_date ? start_date.beginning_of_day : nil
    @end_date = end_date ? end_date.end_of_day : nil
    @created_by = created_by
  end

  def all
    @all ||= begin
      result = venue.incident_reports.enabled.includes(:venue, :user, :disabled_by)
      if created_by.present?
        result = result.where(user_id: created_by)
      end
      if start_date.present? && end_date.present?
        result = result.where(created_at: [start_date..end_date])
      end
      result
    end
  end

  private
  attr_reader :venue, :start_date, :end_date, :created_by

end
