class RemovePayRateDescription < ActiveRecord::Migration
  def change
    change_table :pay_rates do |t|
      t.remove :description
    end
  end
end
