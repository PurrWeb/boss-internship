class FixFinanceReportTransitionStates < ActiveRecord::Migration
  def change
    transitions = FinanceReportTransition.where(to_state: 'incomplete')
    transitions.find_each do |transition|
      transition.update_attributes!(to_state: 'ready')
    end
  end
end
