class VenueWithoutChangeOrderQuery
  def initialize(change_orders:)
    @change_orders = change_orders
  end

  def all
    if change_orders.count > 0
      Venue.where("id NOT IN (?)", change_orders.pluck(:venue_id))
    else
      Venue.all
    end
  end

  private
  attr_reader :change_orders
end
