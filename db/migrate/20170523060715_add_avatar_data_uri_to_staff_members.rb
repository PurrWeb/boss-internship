class AddAvatarDataUriToStaffMembers < ActiveRecord::Migration
  def change
    add_column :staff_members, :avatar_data_uri, :text
  end
end
