class CreateSecurityVenues < ActiveRecord::Migration
  def change
    create_table :security_venues do |t|
      t.string :name, null: false
      t.references :creator_user, references: :users, null: false, index: true
      t.text :address
      t.string :lat
      t.string :lng

      t.timestamps null: false
    end

    add_foreign_key :security_venues, :users, column: :creator_user_id
  end
end
