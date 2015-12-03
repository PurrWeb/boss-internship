class CreateVenuesTable < ActiveRecord::Migration
  def change
    create_table :venues do |t|
      t.string :name
      t.timestamps

      t.index :name
    end
  end
end
