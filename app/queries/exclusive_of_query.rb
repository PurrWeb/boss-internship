class ExclusiveOfQuery
  def initialize(relation:, excluded:)
    @relation = relation
    @excluded = excluded
  end

  def all
    relation.where.not(id: excluded.id)
  end

  private
  attr_reader :relation, :excluded
end
