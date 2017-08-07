class ChecklistSubmissionsIndexFilter
  def initialize(user:, params:)
    normalised_params = (params || {}).reverse_merge(default_params)
    
    @venue = Venue.find_by(id: Integer(normalised_params.fetch(:venue_id)))
    @start_date = check_date(normalised_params.fetch(:start_date))
    @end_date = check_date(normalised_params.fetch(:end_date))
    @created_by = User.find_by(id: check_created_by(normalised_params.fetch(:created_by)))
    @status = check_status(normalised_params.fetch(:status))
    @page = check_page(normalised_params.fetch(:page))
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

  def check_status(status)
    if status.present? && ["true", "false", true, false].exclude?(status)
      raise "Checklist review status value invalid - '#{status}', should be true or false"
    end
    status
  end

  def check_date(date)
    unless date.nil?
      begin
        Date.parse(date)
      rescue => err
        raise "Checklist review date param #{err.message}"
      end
    end
    date
  end

  def check_created_by(created_by)
    unless created_by.nil?
      begin
        Integer(created_by)
      rescue => err
        raise "Checklist review #{err.message} for: created_by"
      end
    end
    created_by
  end

  def check_page(page)
    unless page.nil?
      begin
        Integer(page)
      rescue => err
        raise "Checklist review #{err.message} for: page"
      end
    end
    page
  end

  def default_params
    {
      page: 1,
      venue_id: nil,
      start_date: nil,
      end_date: nil,
      created_by: nil,
      status: nil
    }
  end
end
