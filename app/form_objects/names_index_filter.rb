class NamesIndexFilter
  def initialize(params)
    params = params || default_params
    @enabled = params.fetch(:enabled)
    @name = params.fetch(:name)
  end
  attr_reader :enabled, :name

  def query
    @query ||= NamesIndexQuery.new(
      enabled: enabled,
      name: name
    )
  end

  private
  def default_params
    {
      enabled: nil,
      name: nil
    }
  end
end
