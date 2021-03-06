class AddColumnLatitudeLongitude < ActiveRecord::Migration
  def change
    add_column :venues, :latitude, :decimal, { precision: 10, scale: 6 }
    add_column :venues, :longitude, :decimal, { precision: 10, scale: 6 }
  end
end
