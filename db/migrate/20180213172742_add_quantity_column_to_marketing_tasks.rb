class AddQuantityColumnToMarketingTasks < ActiveRecord::Migration
  def change
    add_column :marketing_tasks, :quantity, :integer
  end
end
