class ChangeFrozenByFieldNames < ActiveRecord::Migration
  def change
    remove_foreign_key :accessory_refund_requests, :frozen_by
    rename_column :accessory_refund_requests, :frozen_by_id, :finance_report_id
    remove_foreign_key :accessory_requests, :frozen_by
    rename_column :accessory_requests, :frozen_by_id, :finance_report_id
    rename_column :holidays, :frozen_by_finance_report_id, :finance_report_id
    rename_column :hours_acceptance_periods, :frozen_by_finance_report_id, :finance_report_id
    rename_column :owed_hours, :frozen_by_finance_report_id, :finance_report_id
  end
end
