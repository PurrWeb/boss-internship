class QueryCombiner
  def initialize(base_scope:, relation_1:, relation_2:)
    @base_scope = base_scope
    @relation_1 = relation_1
    @relation_2 = relation_2
  end

  attr_reader :base_scope, :relation_1, :relation_2

  def all
    base_scope.where(
      'id IN (?) OR id IN (?)',
      relation_1.pluck(:id),
      relation_2.pluck(:id)
    )
  end
end
