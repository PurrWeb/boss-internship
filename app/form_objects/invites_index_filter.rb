class InvitesIndexFilter
  def initialize(params)
    params = params || default_params
    @status = params.fetch(:status)
    @role = params.fetch(:role)
  end
  attr_reader :status, :role

  def query
    @query ||= InvitesIndexQuery.new(
      status: status,
      role: role
    )
  end

  private
  def default_params
    {
      status: :open,
      role: nil
    }
  end
end
