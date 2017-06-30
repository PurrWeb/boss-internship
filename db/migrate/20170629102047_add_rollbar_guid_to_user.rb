class AddRollbarGuidToUser < ActiveRecord::Migration
  def change
    add_column :users, :rollbar_guid, :string

    User.reset_column_information
    User.transaction do
      User.find_each do |user|
        user.rollbar_guid = SecureRandom.uuid
        user.save!
      end
    end 

    change_column_null :users, :rollbar_guid, false
  end
end
