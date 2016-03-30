class VenueWithoutChangeOrderQuery
  def initialize(date:)
    @date = date
  end

  def all
    week = RotaWeek.new(date)

    change_orders = InRangeQuery.new(
      relation: ChangeOrder.all,
      start_value: week.start_date,
      end_value: week.end_date,
      start_column_name: 'date',
      end_column_name: 'date'
    ).all

    if change_orders.count > 0
      Venue.where("id NOT IN (?)", change_orders.pluck(:venue_id))
    else
      Venue.all
    end
  end

  private
  attr_reader :date
end
