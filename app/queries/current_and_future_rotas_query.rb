class CurrentAndFutureRotasQuery
  def initialize(relation: Rota.all, now: Time.zone.now)
    @relation = relation
    @week = RotaWeek.new(now)
  end

  def all
    relation.where('`date` >= ?', week.start_date)
  end

  private
  attr_reader :week, :relation
end
