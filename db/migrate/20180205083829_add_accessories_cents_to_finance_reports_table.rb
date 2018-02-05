class AddAccessoriesCentsToFinanceReportsTable < ActiveRecord::Migration
  def change
    add_column :finance_reports, :accessories_cents, :integer
  end
end
