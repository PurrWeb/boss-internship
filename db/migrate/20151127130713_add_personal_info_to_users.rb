class AddPersonalInfoToUsers < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.integer :address_id
      t.string :role
      t.string :gender, limit: 1
      t.string :phone_number
      t.boolean :enabled, default: true
      t.string :first_name
      t.string :sir_name
      t.datetime :date_of_birth
      t.string :national_insurance_number
      t.text :hours_preference_note
      t.text :day_perference_note
      t.index :enabled
      t.index :phone_number
      t.index :role
    end

    change_column_null :users, :address_id, false
    change_column_null :users, :role, false
    change_column_null :users, :gender, false
    change_column_null :users, :phone_number, false
    change_column_null :users, :enabled, false
    change_column_null :users, :first_name, false
    change_column_null :users, :sir_name, false
    change_column_null :users, :date_of_birth, false
  end
end
