class ChecklistSubmissionsPageData
  def initialize(submissions:, params:)
    normalized_params = (params || {}).reverse_merge(default_params)
    @submissions = submissions
    @page = normalized_params.fetch(:page)
    @status = normalized_params.fetch(:status)
    @created_by = normalized_params.fetch(:created_by)
    @start_date = normalized_params.fetch(:start_date)
    @end_date = normalized_params.fetch(:end_date)
    @per_page = normalized_params.fetch(:per_page)
  end

  attr_reader :submissions, :page, :status, :created_by, :start_date, :end_date, :per_page

  def get_data
    submissions_paginated = submissions.paginate(
      page: page,
      per_page: per_page
    )
    {
      submissions: ActiveModel::Serializer::CollectionSerializer.new(submissions_paginated, serializer: CheckListSubmissionSerializer),
      size: submissions.size,
      page: page,
      status: status,
      created_by: created_by,
      start_date: start_date,
      end_date: end_date,
      per_page: per_page
    }
  end

  private

  def default_params
    {
      page: 1,
      status: nil,
      created_by: nil,
      start_date: nil,
      end_date: nil,
      per_page: CheckListSubmission::SUBMISSIONS_PER_PAGE,
    }
  end
end
