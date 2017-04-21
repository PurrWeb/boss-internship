class RemoveIndexesFromAccessTokens < ActiveRecord::Migration
  def change
    remove_index :access_tokens, :token_type
    remove_index :access_tokens, :expires_at
  end
end
