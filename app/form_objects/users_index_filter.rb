class UsersIndexFilter
  def initialize(params)
    params = params || default_params
    @role = params.fetch(:role)
    @status = params.fetch(:status)
    @email_text = params.fetch(:email_text)
    @name_text = params.fetch(:name_text)
  end
  attr_reader :role, :status, :email_text, :name_text

  def query
    @query ||= UsersIndexQuery.new(
      name_text: name_text,
      email_text: email_text,
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
      email_text: '',
      name_text: '',
      role: nil,
      status: 'enabled'
    }
  end
end
