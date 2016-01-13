class AddCreationTrackingToModels < ActiveRecord::Migration
  def change
    add_column(:users, :invite_id, :integer)
    add_column(:users, :first, :boolean)
    add_column(:staff_members, :creator_id, :integer)
    add_column(:staff_types, :creator_id, :integer)
    add_column(:venues, :creator_id, :integer)

    add_index(:users, :invite_id)
    add_index(:staff_members, :creator_id)
    add_index(:staff_types, :creator_id)
    add_index(:venues, :creator_id)

    User.first.update_attribute(:first, true)
    Invite.where.not(user_id: nil).find_each do |invite|
      invite.user.update_attribute(:invite_id, invite.id)
      invite.user.update_attribute(:first, false)
    end
    StaffMember.update_all(creator_id: 1)
    StaffType.update_all(creator_id: 1)
    Venue.update_all(creator_id: 1)
  end
end
