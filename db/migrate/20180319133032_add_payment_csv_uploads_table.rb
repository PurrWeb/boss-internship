class AddPaymentCsvUploadsTable < ActiveRecord::Migration
  def change
    create_table(:payment_csv_uploads) do |t|
      t.integer :uploaded_by_user_id, null: false
      t.string :file
      t.timestamps
    end
  end
end
