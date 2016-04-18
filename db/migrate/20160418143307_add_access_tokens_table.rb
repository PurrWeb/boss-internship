class AddAccessTokensTable < ActiveRecord::Migration
  def change
    create_table :access_tokens do |t|
      t.string :token, null: false, unique: true
      t.integer :staff_member_id
      t.integer :user_id
      t.datetime :expires_at
      t.string :token_type, null: false
      t.integer :creator_id, null: false
      t.string :creator_type, null: false
      t.timestamps

      t.index :token
      t.index :expires_at
    end
  end
end
