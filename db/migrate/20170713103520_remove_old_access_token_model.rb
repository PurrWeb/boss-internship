class RemoveOldAccessTokenModel < ActiveRecord::Migration
  def change
    drop_table :access_tokens
  end
end
