class ChecklistSubmissionsIndexFilter
  def initialize(user:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    
    @venue = Venue.find_by(id: normalised_params.fetch(:venue_id))
    @start_date = normalised_params.fetch(:start_date)
    @end_date = normalised_params.fetch(:end_date)
    @created_by = User.find_by(id: normalised_params.fetch(:created_by))
    @status = normalised_params.fetch(:status)
    @user = user
  end

  attr_reader :venue, :start_date, :end_date, :created_by, :status, :user

  def checklist_submissions_index_query
    ChecklistSubmissionsIndexQuery.new(
      venue: venue,
      start_date: start_date,
      end_date: end_date,
      created_by: created_by,
      status: status,
      user: user
    ).all
  end

  private

  def default_params
    {
      venue_id: nil,
      start_date: nil,
      end_date: nil,
      created_by: nil,
      status: nil
    }
  end
end
