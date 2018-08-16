class CreateAccessoryRestockTable < ActiveRecord::Migration
  def change
    create_table :accessory_restocks do |t|
      t.references :accessory, index: true, null: false
      t.integer :count, null: false, default: 0
      t.integer :delta, null: false
      t.references :created_by_user,  references: :users, null: false, index: true
      t.references :accessory_request

      t.timestamps null: false
    end
  end
end
