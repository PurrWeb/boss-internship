class DeleteClockingNote
  Result = Struct.new(:success, :clocking_note) do
    def success?
      success
    end
  end

  def initialize(clocking_note:, requester:)
    @clocking_note = clocking_note
    @requester = requester
    @ability = StaffMemberAbility.new(requester)
  end

  def call
    success = false
    ability.authorize!(:delete, :note)

    ActiveRecord::Base.transaction do
      success = clocking_note.destroy
    end

    Result.new(success, clocking_note)
  end

  private
  attr_reader :clocking_note, :requester, :ability
end
