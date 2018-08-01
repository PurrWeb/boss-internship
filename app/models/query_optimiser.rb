# Some utility methods to help share earger loading code between
# different controller actions that render the same view
class QueryOptimiser
  OPTIMISATIONS = {
    staff_member_show: [
      { holidays: [:finance_report, { creator: [:name]} ]},
      { owed_hours: [:staff_member, :creator, :finance_report] },
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
