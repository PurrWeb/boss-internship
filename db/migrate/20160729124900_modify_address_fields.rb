class ModifyAddressFields < ActiveRecord::Migration
  def change
    change_table :addresses do |t|
      t.text :address
      t.rename :region, :county
    end
  end
end
