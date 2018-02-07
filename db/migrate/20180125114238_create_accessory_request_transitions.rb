class CreateAccessoryRequestTransitions < ActiveRecord::Migration
  def change
    create_table :accessory_request_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :accessory_request_id, null: false
      t.timestamps null: false
    end
  end
end
