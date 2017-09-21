class MachineIndexQuery
  def initialize(venue:, filter:)
    @venue = venue
    @filter = filter
  end

  def all
    @all ||= begin
      result = filtered_machines.includes(:venue, :user, :disabled_by)
      result
    end
  end

  private
  attr_reader :venue, :filter

  def filtered_machines
    unless ["enabled", "all"].include? filter
      raise "Machine filter error"
    end

    case filter
      when "enabled"
        venue.machines.enabled
      when "all"
        venue.machines
    end
  end

end
