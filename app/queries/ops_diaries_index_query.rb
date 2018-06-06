class OpsDiariesIndexQuery
  def initialize(filter:)
    @filter = filter
  end

  def all
    ops_diaries = OpsDiary.all
    ops_diaries = ops_diaries.where(priority: filter[:priorities].map {|priority| OpsDiary.priorities[priority]} ) if filter[:priorities].present?
    if filter[:status].present?
      if filter[:status] == 'active'
        ops_diaries = ops_diaries.active
      end
    end
    if filter[:start_date].present? && filter[:end_date].present?
      ops_diaries = InRangeQuery.new(
        relation: ops_diaries,
        start_value: UIRotaDate.parse_if_present(filter[:start_date]).beginning_of_day,
        end_value: UIRotaDate.parse_if_present(filter[:end_date]).end_of_day,
        start_column_name: 'created_at',
        end_column_name: 'created_at'
      ).all
    end
    if filter[:venue_ids].present?
      ops_diaries = ops_diaries.where(venue_id: filter[:venue_ids])
    end
    ops_diaries
  end

  attr_reader :filter
end
