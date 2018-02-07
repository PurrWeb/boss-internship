class CreateAccessoryRequests < ActiveRecord::Migration
  def change
    create_table :accessory_requests do |t|
      t.references :accessory, null: false, index: true
      t.references :staff_member, null: false, index: true
      t.integer :status, null: false
      t.integer :accessory_type, null: false
      t.integer :price_cents, null: false
      t.string :size

      t.timestamps null: false
    end
  end
end
