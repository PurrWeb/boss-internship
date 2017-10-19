class AddVoucherModels < ActiveRecord::Migration
  def change
    create_table :vouchers do |t|
      t.integer :user_id, null: false
      t.integer :venue_id, null: false
      t.boolean :enabled, null: false
      t.string :description, null: false
      t.timestamps

      t.index [:venue_id, :enabled]
      t.index [:venue_id]
    end

    create_table :voucher_usages do |t|
      t.integer :voucher_id, null: false
      t.integer :user_id, null: false
      t.integer :staff_member_id, null: false
      t.boolean :enabled, null: false
      t.timestamps
    end
  end
end
