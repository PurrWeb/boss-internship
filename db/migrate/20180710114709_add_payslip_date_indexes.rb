class AddPayslipDateIndexes < ActiveRecord::Migration
  def change
    add_index :holidays, :payslip_date
    add_index :owed_hours, :payslip_date
  end
end
