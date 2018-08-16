class TemporaryFinanceReportRecordChanges < ActiveRecord::Migration
  def change
    #Remove column nulls so that we can create empty records
    change_column_null :finance_reports, :staff_member_name, true
    change_column_null :finance_reports, :venue_name, true
    change_column_null :finance_reports, :monday_hours_count, true
    change_column_null :finance_reports, :tuesday_hours_count, true
    change_column_null :finance_reports, :wednesday_hours_count, true
    change_column_null :finance_reports, :thursday_hours_count, true
    change_column_null :finance_reports, :friday_hours_count, true
    change_column_null :finance_reports, :saturday_hours_count, true
    change_column_null :finance_reports, :sunday_hours_count, true
    change_column_null :finance_reports, :total_hours_count, true
    change_column_null :finance_reports, :total_cents, true
    change_column_null :finance_reports, :holiday_days_count, true
    change_column_null :finance_reports, :owed_hours_minute_count, true
    change_column_null :finance_reports, :pay_rate_description, true
    change_column_null :finance_reports, :accessories_cents, true
    change_column_null :finance_reports, :contains_time_shifted_owed_hours, true
    change_column_null :finance_reports, :contains_time_shifted_holidays, true

    change_table :finance_reports do |t|
      t.boolean :requiring_update, null: true
    end
    FinanceReport.update_all(requiring_update: false)

    change_column_null :finance_reports, :requiring_update, false
  end
end
