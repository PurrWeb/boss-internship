class UsersIndexQuery
  def initialize(role:, status:, relation: User.unscoped)
    @relation = relation
    @role = role
    @status = status
  end
  attr_reader :role

  def all
    @all ||= begin
      result = relation
      result = filter_by_status(result)
      result = result.where(role: role) if role.present?
      result = result.
        joins(:name).
        order('`names`.first_name, `names`.surname')
      result
    end
  end

  private
  attr_reader :relation, :status

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
