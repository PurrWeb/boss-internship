class CreateAccessoryRefundRequests < ActiveRecord::Migration
  def change
    create_table :accessory_refund_requests do |t|
      t.references :accessory_request, null: false, index: true
      t.references :staff_member, null: false, index: true
      t.integer :price_cents

      t.timestamps null: false
    end
    
    add_index(:accessory_refund_requests,
              [:accessory_request_id, :staff_member_id],
              unique: true,
              name: "index_accessory_refund_requests_accessory_request_staff_member")
  end
end
