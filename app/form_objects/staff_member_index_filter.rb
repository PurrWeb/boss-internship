class StaffMemberIndexFilter < Reform::Form
  def initialize(user:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    @user = user
    @name_text = normalised_params.fetch(:name_text)
    @email_text = normalised_params.fetch(:email_text)
    @status = normalised_params.fetch(:status)
    @staff_type = StaffType.find_by(id: normalised_params.fetch(:staff_type))
    @venue = Venue.find_by(id: normalised_params.fetch(:venue))
    @filter_master_venue = normalised_params.fetch(:filter_master_venue)
    super(OpenStruct.new)
  end

  attr_reader :staff_type, :venue, :status, :name_text, :email_text, :filter_master_venue

  property :venue
  property :staff_type
  property :status
  property :name_text
  property :email_text

  def accessible_venues
    @accessible_venues ||= AccessibleVenuesQuery.new(user).all
  end

  def accessible_staff_types
    StaffType.all
  end

  def select_statuses
    ['enabled', 'disabled']
  end

  # Needed to back bootstrap form
  def self.validators_on(args)
    []
  end

  def security_manager_staff_member_index_query
    StaffMemberIndexQuery.new(
      relation: StaffMember.unscoped,
      name_text: name_text,
      email_text: email_text,
      filter_venues: false,
      filter_master_venue: filter_master_venue,
      venue: nil,
      accessible_venues: nil,
      status_proc: lambda do |relation|
        StaffMemberIndexQuery.
          filter_by_status(
            status: status,
            relation: relation
          )
      end,
      staff_type_proc: lambda do |relation|
        relation.
         joins(:staff_type).
         merge(StaffType.security)
      end
    ).all
  end

  def staff_member_index_query
    StaffMemberIndexQuery.new(
      relation: StaffMember.unscoped,
      name_text: name_text,
      email_text: email_text,
      venue: venue,
      filter_master_venue: filter_master_venue,
      accessible_venues: accessible_venues,
      filter_venues: venue && !(staff_type && staff_type.security?),
      status_proc: lambda do |relation|
        StaffMemberIndexQuery.
          filter_by_status(
            status: status,
            relation: relation
          )
      end,
      staff_type_proc: lambda do |relation|
        if staff_type.present?
          relation.where(staff_type: staff_type)
        else
          relation
        end
      end
    ).all
  end

  def flagged_staff_member_query
    StaffMemberIndexQuery.new(
      relation: StaffMember.unscoped,
      name_text: name_text,
      email_text: email_text,
      filter_venues: false,
      filter_master_venue: filter_master_venue,
      venue: nil,
      accessible_venues: nil,
      status_proc: lambda do |relation|
        relation.flagged
      end,
      staff_type_proc: lambda do |relation|
        relation
      end
    ).all
  end

  private
  attr_reader :user

  def default_params
    {
      name_text: '',
      email_text: '',
      status: 'enabled',
      staff_type: nil,
      venue: nil,
      filter_master_venue: false
    }
  end
end
