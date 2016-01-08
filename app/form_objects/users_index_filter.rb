class UsersIndexFilter
  def initialize(params)
    params = params || default_params
    @role = params.fetch(:role)
  end
  attr_reader :role

  def query
    @query ||= UsersIndexQuery.new(
      role: role
    )
  end

  private
  def default_params
    {
      role: nil
    }
  end
end
