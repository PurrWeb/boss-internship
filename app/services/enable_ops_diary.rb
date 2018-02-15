class EnableOpsDiary
  Result = Struct.new(:success, :ops_diary) do
    def success?
      success
    end
  end

  def initialize(ops_diary:)
    @ops_diary = ops_diary
  end

  def call
    success = false

    ActiveRecord::Base.transaction do
      success = ops_diary.update(disabled_at: nil)
      raise ActiveRecord::Rollback unless success
    end

    Result.new(success, ops_diary)
  end

  private
  attr_reader :ops_diary
end
