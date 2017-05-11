class AddIndexesForFinanceReport < ActiveRecord::Migration
  def change
    add_index(:owed_hours, :disabled_at)
    add_index(:owed_hours, :staff_member_id)
    add_index(:clock_in_periods, :ends_at)
  end
end
