class AddPhoneNumberToWtlClientsTable < ActiveRecord::Migration
  def change
    add_column :wtl_clients, :phone_number, :string, null: false
  end
end
