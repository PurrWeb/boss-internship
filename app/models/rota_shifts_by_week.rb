class RotaShiftsByWeek
  include Enumerable

  def initialize(shifts)
    @shifts = shifts
  end

  def each(&block)
    shifts_by_week.each(&block)
  end

  private
  attr_reader :shifts

  def shifts_by_week
    @shifts_by_week ||= begin
      result = {}

      shifts.each do |shift|
        week = RotaWeek.new(shift.starts_at)
        result[week] = result[week] || []
        result[week] << shift
      end
      result.sort.to_h
    end
  end
end
