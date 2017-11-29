class DashboardMessageAppApiErrors
  def initialize(dashboard_message)
    @dashboard_message = dashboard_message
  end

  attr_reader :dashboard_message

  def errors
    result = {}
    result[:base] = dashboard_message.errors[:base] if dashboard_message.errors[:base].present?

    result[:venueIds] = dashboard_message.errors[:venues] if dashboard_message.errors[:venues].present?
    result[:toAllVenues] = dashboard_message.errors[:to_all_venues] if dashboard_message.errors[:to_all_venues].present?
    result[:title] = dashboard_message.errors[:title] if dashboard_message.errors[:title].present?
    result[:message] = dashboard_message.errors[:message] if dashboard_message.errors[:message].present?
    result[:publishedTime] = dashboard_message.errors[:published_time] if dashboard_message.errors[:published_time].present?

    result
  end
end
