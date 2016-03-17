class SecurityManagerStaffMemberIndexQuery
  def initialize(status:)
    @status = status
  end

  def all
    result = StaffMember.
      joins(:staff_type).
      merge(StaffType.security)

    filter_by_status(result)
  end

  private
  attr_reader :status

  def filter_by_status(relation_to_filter)
    case status
    when 'enabled'
      relation_to_filter.enabled
    when 'disabled'
      relation_to_filter.disabled
    else
      relation_to_filter
    end
  end
end
