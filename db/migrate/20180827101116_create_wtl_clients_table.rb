class CreateWtlClientsTable < ActiveRecord::Migration
  def change
    create_table :wtl_clients do |t|
      t.string :first_name, null: false
      t.string :surname, null: false
      t.string :gender, null: false
      t.date :date_of_birth, null: false
      t.string :email, null: false, unique: true
      t.string :university, null: false
      t.integer :email_status, null: false, default: 0
      t.integer :status, null: false, default: 0
      t.references :wtl_card, null: false, unique: true, index: true

      t.timestamps null: false
    end
  end
end
