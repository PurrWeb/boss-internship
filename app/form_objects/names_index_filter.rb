class NamesIndexFilter
  def initialize(params)
    params = params || default_params
    @enabled = params.fetch(:enabled)
  end
  attr_reader :enabled

  def query
    @query ||= NamesIndexQuery.new(
      enabled: enabled
    )
  end

  private
  def default_params
    {
      enabled: nil,
    }
  end
end
