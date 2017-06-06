class NamesIndexFilter
  def initialize(params)
    params = params || default_params
    @name = params.fetch(:name)
  end
  attr_reader :enabled, :name

  def query
    @query ||= NamesIndexQuery.new(
      enabled: true,
      name: name
    )
  end

  private
  def default_params
    {
      name: nil
    }
  end
end
