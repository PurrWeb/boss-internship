class CreateFinanceReportTransitions < ActiveRecord::Migration
  def change
    create_table :finance_report_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :finance_report_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:finance_report_transitions,
              [:finance_report_id, :sort_key],
              unique: true,
              name: "index_finance_report_transitions_parent_sort")
    add_index(:finance_report_transitions,
              [:finance_report_id, :most_recent],
              unique: true,
              
              name: "index_finance_report_transitions_parent_most_recent")
  end
end
