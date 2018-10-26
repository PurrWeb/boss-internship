# Adds fields that will be used to skip validations on various records lagacy record
class AddLegacyRecordValidationExceptionFields < ActiveRecord::Migration
  def change
    change_table :hours_acceptance_periods do |t|
      #these will be removed when all records are processed
      t.datetime :processed_for_legacy_validation_at
      t.boolean :legacy_validation_process_issue
      t.index :processed_for_legacy_validation_at, name: 'legacy_validation'

      t.boolean :allow_invalid_breaks, null: false, default: false
      t.boolean :allow_no_finance_report, null: false, default: false
      t.boolean :allow_no_accepter, null: false, default: false
      t.boolean :allow_legacy_overlap_accepted_hours, null: false, default: false
      t.boolean :allow_legacy_conflicting_holiday, null: false, default: false
      t.boolean :allow_legacy_conflicting_owed_hours, null: false, default: false
    end
    change_table :owed_hours do |t|
      #these will be removed when all records are processed
      t.datetime :processed_for_legacy_validation_at
      t.boolean :legacy_validation_process_issue
      t.index :processed_for_legacy_validation_at, name: 'legacy_validation'

      t.boolean :allow_no_finance_report, null: false, default: false
      t.boolean :allow_legacy_overlap_accepted_hours, null: false, default: false
      t.boolean :allow_legacy_conflicting_holiday, null: false, default: false
      t.boolean :allow_legacy_conflicting_owed_hours, null: false, default: false
      t.boolean :allow_legacy_conflicting_holiday_request, null: false, default: false
    end
    change_table :holidays do |t|
      #these will be removed when all records are processed
      t.datetime :processed_for_legacy_validation_at
      t.boolean :legacy_validation_process_issue
      t.index :processed_for_legacy_validation_at, name: 'legacy_validation'

      t.boolean :allow_no_finance_report, null: false, default: false
      t.boolean :allow_legacy_conflicting_rota_shift, null: false, default: false
      t.boolean :allow_legacy_overlap_accepted_hours, null: false, default: false
      t.boolean :allow_legacy_conflicting_holiday, null: false, default: false
      t.boolean :allow_legacy_conflicting_holiday_request, null: false, default: false
      t.boolean :allow_legacy_conflicting_owed_hours, null: false, default: false
    end
  end
end
