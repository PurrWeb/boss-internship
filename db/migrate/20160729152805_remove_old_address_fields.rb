class RemoveOldAddressFields < ActiveRecord::Migration
  def change
    change_table :addresses do |t|
      t.remove :address_1
      t.remove :address_2
      t.remove :address_3
      t.remove :address_4
    end
  end
end
