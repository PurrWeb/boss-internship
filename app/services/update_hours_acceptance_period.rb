class UpdateHoursAcceptancePeriod
  class Result < Struct.new(:success, :hours_acceptance_period)
    def success?
      success
    end
  end

  def initialize(hours_acceptance_period:, starts_at:, ends_at:, status:, breaks_data:, requester:)
    @hours_acceptance_period = hours_acceptance_period
    @starts_at = starts_at
    @ends_at = ends_at
    @status = status
    @breaks_data = breaks_data
    @requester = requester
  end

  def call(call_time: Time.current)
    result = true

    ActiveRecord::Base.transaction do
      hours_acceptance_period.assign_attributes(
        starts_at: starts_at,
        ends_at: ends_at,
        status: status
      )


      hours_acceptance_period.hours_acceptance_breaks.
        enabled.
        where('id NOT IN (?)', update_breaks_ids).find_each do |_break|
          result = result && _break.disable(requester: requester)
        end

      update_break_data.each do |break_data|
        _break = hours_acceptance_period.
          hours_acceptance_breaks.
          find_by!(id: break_data.fetch(:id))

        result = result && _break.update_attributes(
          starts_at: break_data.fetch(:starts_at),
          ends_at: break_data.fetch(:ends_at)
        )
      end

      new_break_data.each do |break_data|
        _break = HoursAcceptanceBreak.new(
          starts_at: break_data.fetch(:starts_at),
          ends_at: break_data.fetch(:ends_at),
          hours_acceptance_period: hours_acceptance_period
        )

        result = result && _break.save
        if result
          hours_acceptance_period.hours_acceptance_breaks << _break
        end
      end

      result = result && hours_acceptance_period.save
    end

    Result.new(result, hours_acceptance_period)
  end

  private
  attr_reader :hours_acceptance_period, :starts_at, :ends_at, :status, :requester, :breaks_data

  def update_break_data
    breaks_data.select do |break_data|
      break_data[:id].present?
    end
  end

  def update_breaks_ids
    update_break_data.map do |break_data|
      Integer(break_data.fetch(:id))
    end
  end

  def new_break_data
    breaks_data.reject do |break_data|
      break_data[:id].present?
    end
  end
end
