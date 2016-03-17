class UsersIndexQuery
  def initialize(role: ,relation: User.unscoped)
    @relation = relation
    @role = role
  end
  attr_reader :role

  def all
    @all ||= begin
      result = relation.enabled
      result = result.where(role: role) if role.present?
      result = result.
        joins(:name).
        order('`names`.first_name, `names`.surname')
      result
    end
  end

  private
  attr_reader :relation
end
