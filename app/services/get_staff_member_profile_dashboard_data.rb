class GetStaffMemberProfileDashboardData
  def initialize(staff_member:, requester:)
    @staff_member = staff_member
    @requester = requester
  end
  attr_reader :staff_member, :requester

  def call
    staff_types = StaffType.all
    venues = Venue.all
    pay_rates = PayRate.all
    gender_values = StaffMember::GENDERS
    accessible_venues = AccessibleVenuesQuery.new(requester).all
    accessible_pay_rates = UserAccessiblePayRatesQuery.new(
      user: requester,
      pay_rate: staff_member.pay_rate
    ).page_pay_rates

    app_download_link_data = GetAppDownloadLinkData.new(staff_member: staff_member).call

    StaffMemberProfileDashboardData.new(
      staff_member: staff_member,
      staff_types: staff_types,
      venues: venues,
      pay_rates: pay_rates,
      gender_values: gender_values,
      accessible_venue_ids: accessible_venues.pluck(:id),
      accessible_pay_rate_ids: accessible_pay_rates.map(&:id),
      app_download_link_data: app_download_link_data
    )
  end
end
