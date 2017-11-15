class CreateDashboardMessage
  attr_reader :created_by_user, :to_all_venues, :title, :message, :published_time, :api_errors, :venue_ids, :dashboard_message

  def initialize(params)
    @created_by_user = params.fetch(:created_by_user)
    @to_all_venues = params.fetch(:to_all_venues).blank? ? false : params.fetch(:to_all_venues)
    @title = params.fetch(:title)
    @message = params.fetch(:message)
    @published_time = params.fetch(:published_time)
    @venue_ids = params[:venue_ids] || []
  end

  def save
    DashboardMessage.transaction do
      @dashboard_message = DashboardMessage.new(
        created_by_user: created_by_user,
        to_all_venues: to_all_venues,
        title: title,
        message: message,
        published_time: published_time
      )

      if !dashboard_message.to_all_venues?
        dashboard_message.venues << Venue.where(id: venue_ids.uniq)
      end

      if dashboard_message.valid? && dashboard_message.save
        true
      else
        @api_errors = DashboardMessageAppApiErrors.new(dashboard_message)

        false
      end
    end
  end
end
