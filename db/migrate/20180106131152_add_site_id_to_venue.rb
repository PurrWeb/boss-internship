class AddSiteIdToVenue < ActiveRecord::Migration
  def change
    change_table :venues do |t|
      t.string :change_order_site_id
    end
  end
end
