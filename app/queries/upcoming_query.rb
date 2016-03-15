class UpcomingQuery
  def initialize(relation:, now: Time.now, start_column_name: 'starts_at')
    @now = now
    @relation = relation
    @start_column_name = start_column_name
  end

  def all
    relation.
      where("#{start_column_name} > ?", now)
  end

  private
  attr_reader :relation, :start_column_name, :now
end
