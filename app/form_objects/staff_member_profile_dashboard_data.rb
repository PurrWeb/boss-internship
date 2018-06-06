class StaffMemberProfileDashboardData
  def initialize(staff_member:, staff_types:, venues:, accessible_venue_ids:, pay_rates:, gender_values:, accessible_pay_rate_ids:, app_download_link_data:)
    @staff_member = staff_member
    @staff_types = staff_types
    @venues = venues
    @pay_rates = pay_rates
    @gender_values = gender_values
    @accessible_venue_ids = accessible_venue_ids
    @accessible_pay_rate_ids = accessible_pay_rate_ids
    @app_download_link_data = app_download_link_data
  end
  attr_reader :staff_member, :staff_types, :venues, :pay_rates, :gender_values, :accessible_venue_ids, :accessible_pay_rate_ids, :app_download_link_data
end
