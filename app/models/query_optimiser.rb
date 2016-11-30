class QueryOptimiser
  OPTIMISATIONS = {
    staff_member_show: [
      { holidays: [:frozen_by, { creator: [:name]} ]},
      { owed_hours: [:staff_member, :creator, :frozen_by] },
      [:name]
    ]
  }

  def self.get_optimisations(page)
    OPTIMISATIONS.fetch(page)
  end

  def self.apply_optimisations(relation, page)
    optimisations = get_optimisations(page)
    optimisations.inject(relation) do |relation, optimisation|
      relation.includes(optimisation)
    end
  end
end
