class AddPayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.integer :staff_member_id, null: false
      t.integer :created_by_user_id, null: false
      t.date :date, null: false
      t.datetime :disabled_at
      t.integer :cents, null: false
      t.datetime :received_at
      t.datetime :disabled_at
      t.integer :disabled_by_user_id
      t.timestamps
    end
  end
end
