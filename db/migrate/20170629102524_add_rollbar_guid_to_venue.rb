class AddRollbarGuidToVenue < ActiveRecord::Migration
  def change
    add_column :venues, :rollbar_guid, :string

    Venue.reset_column_information
    Venue.transaction do
      Venue.find_each do |venue|
        venue.rollbar_guid = SecureRandom.uuid
        venue.save!
      end
    end

    change_column_null :venues, :rollbar_guid, false
  end
end
