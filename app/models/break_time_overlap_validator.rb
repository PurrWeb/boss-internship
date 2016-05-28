class BreakTimeOverlapValidator
  def initialize(_break:, break_class:, period_association:)
    @_break = _break
    @break_class = break_class
    @period_association = period_association
  end

  def validate
    if prerequisites_persent?

      relation = break_class.
        where(period_association => period)

      relation = relation.enabled if relation.respond_to?(:enabled)

      query = InRangeQuery.new(
        relation: relation,
        start_value: starts_at,
        end_value: ends_at,
        include_boundaries: false
      ).all

      if _break.persisted?
        query = ExclusiveOfQuery.new(
          relation: query,
          excluded: _break
        ).all
      end

      if query.count > 0
        _break.errors.add(:base, 'break overlaps existing break')
      end
    end
  end

  private
  attr_accessor :_break, :break_class, :period_association

  def prerequisites_persent?
    _break.starts_at.present? &&
      _break.ends_at.present? &&
      period.present?
  end

  def starts_at
    _break.starts_at
  end

  def ends_at
    _break.ends_at
  end

  def period
    _break.public_send(period_association)
  end
end
