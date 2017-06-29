class AddRollbarGuidToUser < ActiveRecord::Migration
  def change
    add_column :users, :rollbar_guid, :string

    User.transaction do
      User.find_each do |user|
        user.rollbar_guid = SecureRandom.uuid
        user.save!
      end
    end 
  end
end
