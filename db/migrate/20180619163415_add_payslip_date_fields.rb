class AddPayslipDateFields < ActiveRecord::Migration
  def change
    change_table :owed_hours do |t|
      t.date :payslip_date
    end
    change_table :holidays do |t|
      t.date :payslip_date
    end

    ActiveRecord::Base.transaction do
      OwedHour.find_each do |owed_hour|
        owed_hour.assign_attributes(payslip_date: owed_hour.date)
        owed_hour.save(validate: false)
      end
      Holiday.find_each do |holiday|
        week = RotaWeek.new(holiday.start_date)
        holiday.assign_attributes(payslip_date: week.start_date)
        holiday.save(validate: false)
      end

      change_column_null :owed_hours, :payslip_date, false
      change_column_null :holidays, :payslip_date, false
    end
  end
end
