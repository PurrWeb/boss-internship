class AllowDisablePayrates < ActiveRecord::Migration
  def change
    change_table :pay_rates do |t|
      t.boolean :enabled, default: true, null: false
    end
  end
end
