class RemovPaymentCsvUploadsTable < ActiveRecord::Migration
  def change
    drop_table :payment_csv_uploads
  end
end
