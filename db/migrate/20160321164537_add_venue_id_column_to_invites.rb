class AddVenueIdColumnToInvites < ActiveRecord::Migration
  def change
    change_table :invites do |t|
      t.text :venue_ids
    end
  end
end
