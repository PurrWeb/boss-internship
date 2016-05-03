class ApiKey < ActiveRecord::Migration
  def change
    create_table :api_keys do |t|
      t.integer :user_id, null: false
      t.string :key, null: false, unique: true
      t.integer :venue_id, null: false
      t.timestamps
    end
  end
end
