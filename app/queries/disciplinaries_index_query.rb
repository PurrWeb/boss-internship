class DisciplinariesIndexQuery
  def initialize(staff_member:, filter:)
    @staff_member = staff_member
    @filter = filter
  end

  def all
    disciplinaries = staff_member.disciplinaries.includes([:created_by_user, :disabled_by_user])
    if filter[:start_date].present? && filter[:end_date].present?
      disciplinaries = InRangeQuery.new(
        relation: disciplinaries,
        start_value: filter[:start_date],
        end_value: filter[:end_date],
        start_column_name: 'created_at',
        end_column_name: 'created_at'
      ).all
    end
    unless filter[:show_expired]
      disciplinaries = disciplinaries.without_expired
    end
    unless filter[:show_disabled]
      disciplinaries = disciplinaries.without_disabled
    end
    disciplinaries
  end

  attr_reader :staff_member, :filter
end
