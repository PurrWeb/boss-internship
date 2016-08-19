class AddPayoutToSafeChecks < ActiveRecord::Migration
  def change
    change_table :safe_checks do |t|
      t.integer :payouts_cents
    end

    SafeCheck.update_all(payouts_cents: 0)
    change_column_null :safe_checks, :payouts_cents, false
  end
end
