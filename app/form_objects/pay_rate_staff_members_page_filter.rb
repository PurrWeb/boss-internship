class PayRateStaffMembersPageFilter < Reform::Form
  def initialize(user:, pay_rate:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    @user = user
    @pay_rate = pay_rate
    @venue = Venue.find_by(id: normalised_params.fetch(:venue))
    @staff_type = StaffType.find_by(id: normalised_params.fetch(:staff_type))
    super(OpenStruct.new)
  end

  attr_reader :user, :pay_rate, :venue, :staff_type

  def accessible_venues
    @accessible_venues ||= AccessibleVenuesQuery.new(user).all
  end

  def accessible_staff_types
    StaffType.all
  end

  def default_params
    {
      venue: nil,
      staff_type: nil
    }
  end

  def query
    PayRateStaffMembersIndexQuery.new(
      pay_rate: pay_rate,
      venue: venue,
      staff_type: staff_type
    ).all
  end

  # Needed to back bootstrap form
  def self.validators_on(args)
    []
  end

  def persisted?
    false
  end
end
