class CreateVenuesUsersJoinTable < ActiveRecord::Migration
  def change
    create_table :venues_users do |t|
      t.integer :user_id
      t.integer :venue_id
      t.boolean :enabled, limit: 1
      t.timestamps

      t.index :enabled
      t.index :created_at
    end

    change_column_null :venues_users, :user_id, false
    change_column_null :venues_users, :venue_id, false
    change_column_null :venues_users, :enabled, false
  end
end
