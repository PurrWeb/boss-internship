class StaffMemberIndexFilter
  def initialize(user:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    @user = user
    @name_text = normalised_params.fetch(:name_text)
    @email_text = normalised_params.fetch(:email_text)
    @status = normalised_params.fetch(:status)
    @staff_type = StaffType.find_by(id: normalised_params.fetch(:staff_type))
    @venue = Venue.find_by(id: normalised_params.fetch(:venue))
  end

  attr_reader :staff_type, :venue, :status, :name_text, :email_text

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
          name_text: name_text,
          email_text: email_text,
          status: status
        ).all

        result.
          joins(:name).
          order('`names`.first_name, `names`.surname')
      end
    else
      @query ||= begin
        result = StaffMemberIndexFilterQuery.new(
          name_text: name_text,
          email_text: email_text,
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
      name_text: '',
      email_text: '',
      status: 'enabled',
      staff_type: nil,
      venue: nil
    }
  end
end
