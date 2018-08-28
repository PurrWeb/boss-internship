class AddPayslipDatesToAccessoryModels < ActiveRecord::Migration
  def change
    change_table :accessory_refund_requests do |t|
      t.date :payslip_date
    end
    change_table :accessory_requests do |t|
      t.date :payslip_date
    end
  end
end
