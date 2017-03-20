class AddIndexToTables < ActiveRecord::Migration
  def change
    add_index :hours_acceptance_periods, :clock_in_day_id
    add_index :hours_acceptance_periods, :status
    add_index :clock_in_periods, :clock_in_day_id
    add_index :clock_in_breaks, :clock_in_period_id
    add_index :clock_in_events, :clock_in_period_id
    add_index :hours_acceptance_breaks, :hours_acceptance_period_id
    add_index :clock_in_notes, :clock_in_day_id
    add_index :access_tokens, :user_id
    add_index :access_tokens, :token_type
  end
end
