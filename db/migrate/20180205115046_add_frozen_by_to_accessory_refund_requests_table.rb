class AddFrozenByToAccessoryRefundRequestsTable < ActiveRecord::Migration
  def change
    add_reference :accessory_refund_requests, :frozen_by, references: :finance_reports, index: true
    add_foreign_key :accessory_refund_requests, :finance_reports, column: :frozen_by_id
  end
end
