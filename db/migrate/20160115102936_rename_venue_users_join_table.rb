class RenameVenueUsersJoinTable < ActiveRecord::Migration
  def change
    rename_table :venues_users, :venue_users
  end
end
