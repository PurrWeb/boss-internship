class StaffMemberIndexFilter
  def initialize(params)
    local_params = params || default_params
    @staff_type = StaffType.find_by(id: local_params.fetch(:staff_type))
  end

  attr_reader :staff_type

  def query
    @query ||= StaffMemberIndexQuery.new(staff_type: staff_type)
  end

  private
  def default_params
    {
      staff_type: nil
    }
  end
end
