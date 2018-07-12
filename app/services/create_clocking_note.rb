class CreateClockingNote
  Result = Struct.new(:success, :clocking_note) do
    def success?
      success
    end
  end

  def initialize(clocking_note_params:, clocking_day_params:, requester:)
    @clocking_note_params = clocking_note_params
    @clocking_day_params = clocking_day_params
    @requester = requester
    @ability = StaffMemberAbility.new(requester)
  end

  def call
    success = false
    clocking_note = nil
    ability.authorize!(:add, :note)

    ActiveRecord::Base.transaction do
      clock_in_day = ClockInDay.find_or_initialize_by(clocking_day_params)

      if clock_in_day.new_record?
        clock_in_day.update_attributes(
          creator: requester
        )
      end

      clocking_note = ClockInNote.new(clocking_note_params.merge({creator: requester, clock_in_day: clock_in_day}))

      success = clocking_note.save
    end

    Result.new(success, clocking_note)
  end

  private
  attr_reader :clocking_note_params, :clocking_day_params, :requester, :ability
end
