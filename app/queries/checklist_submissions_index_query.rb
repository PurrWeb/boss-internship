class ChecklistSubmissionsIndexQuery

  def initialize(
    venue:,
    start_date:,
    end_date:,
    created_by:,
    status:,
    user:
  )
    @venue = venue
    @start_date = start_date
    @end_date = end_date
    @created_by = created_by
    @status = status
    @user = user
  end
  
  attr_reader :venue, :start_date, :end_date, :created_by, :status, :user

  def all
    @all ||= begin
      result = venue.check_list_submissions
      if (start_date && end_date).present?
        paresed_start_date = DateTime.strptime(start_date, '%d-%m-%Y').beginning_of_day
        paresed_end_date = DateTime.strptime(end_date, '%d-%m-%Y').end_of_day
        result = result.where(created_at: [paresed_start_date..paresed_end_date])
      end
      
      unless status.nil?
        if status == 'true'
          result = result.status_ok
        elsif status == 'false'
          result = result.status_problem
        end
      end

      if created_by.present?
        result = result.where(user: created_by)
      end
      result
    end
  end
end
