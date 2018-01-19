class PublishedRotaShiftQuery
  def initialize(relation: RotaShift.all, staff_member:)
    @relation = relation
    @staff_member = staff_member
  end

  def all
    published_rotas = Rota.published
    relation.enabled.where(rota: published_rotas, staff_member: staff_member)
  end

  private
  attr_reader :relation, :staff_member
end
