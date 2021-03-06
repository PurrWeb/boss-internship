class UpdateClockingNote
  Result = Struct.new(:success, :clocking_note) do
    def success?
      success
    end
  end

  def initialize(clocking_note:, note:, requester:)
    @clocking_note = clocking_note
    @note = note
    @requester = requester
    @ability = StaffMemberAbility.new(requester)
  end

  def call
    success = false
    ability.authorize!(:edit, :note)

    ActiveRecord::Base.transaction do
      success = clocking_note.update({ note: note })
    end

    Result.new(success, clocking_note)
  end

  private
  attr_reader :clocking_note, :note, :requester, :ability
end
