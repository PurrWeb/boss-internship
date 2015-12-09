class ExtractStaffMembersFromUsersTable < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.remove :address_id
      t.remove :gender
      t.remove :phone_number
      t.remove :date_of_birth
      t.remove :national_insurance_number
      t.remove :hours_preference_note
      t.remove :day_perference_note
      t.rename :sir_name, :surname
    end

    create_table :staff_members do |t|
      t.string :email
      t.integer :address_id
      t.string :gender
      t.string :phone_number
      t.boolean :enabled, default: true
      t.string :first_name
      t.string :surname
      t.datetime :date_of_birth
      t.string :national_insurance_number
      t.text :hours_preference_note
      t.text :day_perference_note
      t.index :email, unique: true
      t.index :enabled
      t.index :phone_number
      t.timestamps null: false
    end

    change_column_null :staff_members, :email, false
    change_column_null :staff_members, :address_id, false
    change_column_null :staff_members, :gender, false
    change_column_null :staff_members, :phone_number, false
    change_column_null :staff_members, :enabled, false
    change_column_null :staff_members, :first_name, false
    change_column_null :staff_members, :surname, false
    change_column_null :staff_members, :date_of_birth, false

    create_table :staff_member_venues do |t|
      t.integer :staff_member_id
      t.integer :venue_id
      t.boolean :enabled
      t.timestamps null: false
    end

    change_column_null :staff_member_venues, :staff_member_id, false
    change_column_null :staff_member_venues, :venue_id, false
    change_column_null :staff_member_venues, :enabled, false
  end
end
