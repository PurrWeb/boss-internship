class CreateDisciplinary
  Result = Struct.new(:success, :disciplinary) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false

    disciplinary = Disciplinary.new(params)
    success = disciplinary.save

    Result.new(success, disciplinary)
  end

  private
  attr_reader :params
end
