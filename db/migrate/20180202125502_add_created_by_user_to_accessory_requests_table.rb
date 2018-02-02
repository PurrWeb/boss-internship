class AddCreatedByUserToAccessoryRequestsTable < ActiveRecord::Migration
  def change
    add_reference :accessory_requests, :created_by_user, references: :users, index: true
    add_foreign_key :accessory_requests, :users, column: :created_by_user_id
  end
end
