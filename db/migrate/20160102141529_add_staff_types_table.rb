class AddStaffTypesTable < ActiveRecord::Migration
  def change
    create_table :staff_types do |t|
      t.string :name, null: false
      t.timestamps null: false
      t.index :name, unique: true
    end
  end
end
