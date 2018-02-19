class AddAccessoryValuesFinanceReport < ActiveRecord::Migration
  def change
    FinanceReport.where(accessories_cents: nil).update_all(accessories_cents: 0)
    change_column_null(:finance_reports, :accessories_cents, false)
  end
end
