class AddAcceptedAtToHoursAcceptancePeriod < ActiveRecord::Migration
  def change
    add_column :hours_acceptance_periods, :accepted_at, :datetime, default: nil
    add_column :hours_acceptance_periods, :accepted_by_id, :integer, index: true
    add_foreign_key :hours_acceptance_periods, :users, column: :accepted_by_id
  end
end
