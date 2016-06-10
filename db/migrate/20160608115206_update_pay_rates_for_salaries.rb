class UpdatePayRatesForSalaries < ActiveRecord::Migration
  def change
    change_table :pay_rates do |t|
      t.string :calculation_type
    end
    PayRate.update_all(calculation_type: 'incremental_per_hour')

    change_column_null :pay_rates, :calculation_type, false
    rename_column :pay_rates, :cents_per_hour, :cents
  end
end
