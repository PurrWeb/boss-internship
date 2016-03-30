class VenueWithoutChangeOrderNotificationQuery
  def initialize(relation: Venue.unscoped, date: date)
    @relation = relation
    @date = date
  end

  def all
    week = RotaWeek.new(date)

    date_query_string = ActiveRecord::Base.send(
      'sanitize_sql_array',
      [
        'change_order_notifications.created_at > ? AND change_order_notifications.created_at < ?',
        week.start_date,
        week.end_date
      ]
    )

    relation.
      joins("LEFT JOIN change_order_notifications ON venues.id = change_order_notifications.venue_id AND #{date_query_string}")
      .where('change_order_notifications.venue_id IS NULL')
  end

  private
  attr_reader :relation, :date
end
