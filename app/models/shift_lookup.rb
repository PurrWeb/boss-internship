class ShiftLookup
  def initialize(shifts)
    @lookup_data = {}

    shifts.each do |shift|
      id = shift.staff_member.id
      date = shift.date

      lookup_data[id] ||= {}
      lookup_data[id][date] ||= []
      lookup_data[id][date] << shift
    end
  end

  def perform(staff_member:, date:)
    lookup_data[staff_member.id] ||= {}
    lookup_data[staff_member.id][date]
  end

  private
  attr_reader :lookup_data
end
