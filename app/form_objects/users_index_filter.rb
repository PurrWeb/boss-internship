class UsersIndexFilter
  def initialize(params)
    params = params || default_params
    @role = params.fetch(:role)
    @status = params.fetch(:status)
  end
  attr_reader :role, :status

  def query
    @query ||= UsersIndexQuery.new(
      status: status,
      role: role
    )
  end

  def select_statuses
    ['enabled', 'disabled']
  end

  def many_statuses?
    !select_statuses.include?(status)
  end

  private
  def default_params
    {
      role: nil,
      status: 'enabled'
    }
  end
end
