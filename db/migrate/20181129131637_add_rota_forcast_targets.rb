class AddRotaForcastTargets < ActiveRecord::Migration
  def change
    change_table :venues do |t|
      t.decimal :overheads_threshold_percentage, precision: 4, scale: 1
      t.decimal :staff_threshold_percentage, precision: 4, scale: 1
      t.decimal :pr_threshold_percentage, precision: 4, scale: 1
      t.decimal :kitchen_threshold_percentage, precision: 4, scale: 1
      t.decimal :security_threshold_percentage, precision: 4, scale: 1
    end
  end
end
