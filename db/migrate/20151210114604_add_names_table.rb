class AddNamesTable < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.integer :name_id
      t.remove :first_name
      t.remove :surname
    end
    change_column_null :users, :name_id, false

    change_table :staff_members do |t|
      t.integer :name_id
      t.remove :first_name
      t.remove :surname
    end
    change_column_null :staff_members, :name_id, false

    create_table :names do |t|
      t.string :first_name
      t.string :surname
      t.timestamps null: false

      t.index :first_name
      t.index :surname
    end

    change_column_null :names, :first_name, false
    change_column_null :names, :surname, false
  end
end
