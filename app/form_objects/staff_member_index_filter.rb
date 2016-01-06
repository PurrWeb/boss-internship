class StaffMemberIndexFilter
  def initialize(params)
    normalised_params = (params || {}).reverse_merge(default_params)
    @staff_type = StaffType.find_by(id: normalised_params.fetch(:staff_type))
    @venue = Venue.find_by(id: normalised_params.fetch(:venue))
  end

  attr_reader :staff_type, :venue

  def query
    @query ||= StaffMemberIndexQuery.new(
      staff_type: staff_type,
      venue: venue
    )
  end

  private
  def default_params
    {
      staff_type: nil,
      venue: nil
    }
  end
end
