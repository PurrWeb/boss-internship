class PoolLoftApiKeyFeilds < ActiveRecord::Migration
  def change
    change_column_null :api_keys, :venue_id, true
  end
end
