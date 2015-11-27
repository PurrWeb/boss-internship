class AddAddressesTable < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string :address_1
      t.string :address_2
      t.string :address_3
      t.string :address_4
      t.string :region
      t.string :country
      t.string :postcode
      t.timestamps
    end
  end
end
