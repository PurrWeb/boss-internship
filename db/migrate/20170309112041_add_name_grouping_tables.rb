class AddNameGroupingTables < ActiveRecord::Migration
  def change
    create_table :first_name_groups do |t|
      t.boolean :enabled, null: false, deafult: true
      t.timestamps
    end

    create_table :first_name_options do |t|
      t.integer :first_name_group_id, null: false
      t.string :name, null: false
      t.timestamps
    end
  end
end
