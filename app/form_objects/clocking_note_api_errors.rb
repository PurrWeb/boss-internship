class ClockingNoteApiErrors
  def initialize(clocking_note:)
    @clocking_note = clocking_note
  end
  attr_reader :clocking_note

  def errors
    result = {}
    result[:base] = clocking_note.errors[:base] if clocking_note.errors[:base].present?
    result[:clockingNote] = clocking_note.errors[:note] if clocking_note.errors[:note].present?
    result[:clockInDay] = clocking_note.errors[:clock_in_day] if clocking_note.errors[:clock_in_day].present?
    result[:creator] = clocking_note.errors[:creator] if clocking_note.errors[:creator].present?

    result
  end
end
