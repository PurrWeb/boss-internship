class MachinesRefloatsIndexQuery
  def initialize(venue:, params:)
    @venue = venue
    @params = params
  end

  def all
    @all ||= begin
      result = machines_refloats.includes([:machine, :user]).order(created_at: :desc)
      result
    end
  end

  private
  attr_reader :venue, :params

  def machines_refloats
    result = venue.machines_refloats
    if params[:start_date].present? && params[:end_date].present?
      start_date = Date.parse(params.fetch(:start_date)).beginning_of_day
      end_date = Date.parse(params.fetch(:end_date)).end_of_day
      result = result.where(created_at: [start_date..end_date])
    end

    if params[:user_id].present?
      result = result.where(user_id: params.fetch(:user_id))
    end

    if params[:machine_id].present?
      result = result.where(machine_id: params.fetch(:machine_id))
    end
    result
  end

end
