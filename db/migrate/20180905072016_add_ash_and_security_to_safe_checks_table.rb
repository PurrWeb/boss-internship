class AddAshAndSecurityToSafeChecksTable < ActiveRecord::Migration
  def change
    add_column :safe_checks, :ash_cash_cents, :integer
    add_column :safe_checks, :security_plus_cents, :integer

    ActiveRecord::Base.transaction do
      SafeCheck.update_all({
        ash_cash_cents: 0,
        security_plus_cents: 0,
      })
    end

    change_column_null :safe_checks, :ash_cash_cents, false
    change_column_null :safe_checks, :security_plus_cents, false
  end
end
