class AddRollbarGuidToVenue < ActiveRecord::Migration
  def change
    add_column :venues, :rollbar_guid, :string

    Venue.transaction do
      Venue.find_each do |venue|
        venue.rollbar_guid = SecureRandom.uuid
        venue.save!
      end
    end 
  end
end
