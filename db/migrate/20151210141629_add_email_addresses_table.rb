class AddEmailAddressesTable < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.integer :email_address_id
      t.remove :email
    end
    change_column_null :users, :email_address_id, false

    change_table :staff_members do |t|
      t.integer :email_address_id
      t.remove :email
    end
    change_column_null :staff_members, :email_address_id, false

    create_table :email_addresses do |t|
      t.string :email
      t.timestamps null: false

      t.index :email
    end

    change_column_null :email_addresses, :email, false
  end
end
