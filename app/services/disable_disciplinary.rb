class DisableDisciplinary
  Result = Struct.new(:success, :disciplinary) do
    def success?
      success
    end
  end

  def initialize(disciplinary:, requester:)
    @disciplinary = disciplinary
    @requester = requester
  end

  def call
    success = false
    ActiveRecord::Base.transaction do
      success = disciplinary.update({ disabled_by_user: requester, disabled_at: Time.zone.now })
      raise ActiveRecord::Rollback unless success
    end
    Result.new(success, disciplinary)
  end

  private
  attr_reader :disciplinary, :requester
end
