class RemoveSubmissionDeadlineFromChangeOrders < ActiveRecord::Migration
  def change
    change_table :change_orders do |t|
      t.remove :submission_deadline
    end
  end
end
