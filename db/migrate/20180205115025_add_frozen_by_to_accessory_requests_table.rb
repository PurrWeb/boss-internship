class AddFrozenByToAccessoryRequestsTable < ActiveRecord::Migration
  def change
    add_reference :accessory_requests, :frozen_by, references: :finance_reports, index: true
    add_foreign_key :accessory_requests, :finance_reports, column: :frozen_by_id
  end
end
