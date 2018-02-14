class CreateOpsDiary
  Result = Struct.new(:success, :ops_diary) do
    def success?
      success
    end
  end

  def initialize(params:)
    @params = params
  end

  def call
    success = false
    ops_diary = nil

    ops_diary = OpsDiary.new(params)
    success = ops_diary.save

    Result.new(success, ops_diary)
  end

  private
  attr_reader :params
end
