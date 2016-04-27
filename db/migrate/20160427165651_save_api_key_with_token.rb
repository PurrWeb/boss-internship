class SaveApiKeyWithToken < ActiveRecord::Migration
  def change
    change_table :access_tokens do |t|
      t.integer :api_key_id
    end
  end
end
