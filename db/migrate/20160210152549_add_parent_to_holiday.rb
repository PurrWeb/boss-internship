class AddParentToHoliday < ActiveRecord::Migration
  def change
    change_table :holidays do |t|
      t.integer :parent_holiday_id
    end
  end
end
