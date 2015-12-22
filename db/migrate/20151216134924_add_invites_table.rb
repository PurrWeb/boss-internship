class AddInvitesTable < ActiveRecord::Migration
  def change
    create_table :invites do |t|
      t.string  :role
      t.integer :inviter_id
      t.integer :user_id
      t.string   :token
      t.string   :email
      t.integer  :revoker_id
      t.datetime :revoked_at
      t.datetime :sent_at
      t.datetime :accepted_at
      t.timestamps null: false

      t.index :role
      t.index :inviter_id
      t.index :sent_at
      t.index :accepted_at
      t.index :token, unique: true
      t.index :email
    end

    change_column_null :invites, :role, false
    change_column_null :invites, :inviter_id, false
    change_column_null :invites, :token, false
    change_column_null :invites, :email, false
  end
end
