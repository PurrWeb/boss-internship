class AddCheckListTable < ActiveRecord::Migration
  def change
    create_table :check_lists do |t|
      t.string :name, null: false
      t.references :venue, null:false
      
      t.timestamps
    end
    add_index :check_lists, :venue_id
  end
end
