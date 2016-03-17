class StaffMemberIndexFilter
  def initialize(user:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    @user = user
    @status = normalised_params.fetch(:status)
    @staff_type = StaffType.find_by(id: normalised_params.fetch(:staff_type))
    @venue = Venue.find_by(id: normalised_params.fetch(:venue))
  end

  attr_reader :staff_type, :venue, :status

  def accessible_venues
    @accessible_venues ||= AccessibleVenuesQuery.new(user).all
  end

  def accessible_staff_types
    StaffType.all
  end

  def query
    if user.security_manager?
      @query ||= begin
        result = SecurityManagerStaffMemberIndexQuery.new(
          status: status
        ).all

        result.
          joins(:name).
          order('`names`.first_name, `names`.surname')
      end
    else
      @query ||= begin
        result = StaffMemberIndexFilterQuery.new(
          status: status,
          staff_type: staff_type,
          venue: venue,
          accessible_venues: accessible_venues
        ).all
        result.
          joins(:name).
          order('`names`.first_name, `names`.surname')
      end
    end
  end

  def select_statuses
    ['enabled', 'disabled']
  end

  private
  attr_reader :user

  def default_params
    {
      status: 'enabled',
      staff_type: nil,
      venue: nil
    }
  end
end
