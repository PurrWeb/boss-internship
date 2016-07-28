class StaffVettingController < ApplicationController
  def index
    authorize! :manage, :admin

    render locals: {
      staff_without_email: StaffMembersWithoutEmailQuery.new.all,
      staff_without_ni_number: StaffMembersWithoutNINumberQuery.new.all,
      staff_without_address: StaffMembersWithoutAddressQuery.new.all,
      staff_without_photo: StaffMembersWithoutPhotoQuery.new.all
    }
  end

  def staff_members_without_email
    authorize! :manage, :admin

    staff_without_email = StaffMembersWithoutEmailQuery.new.all.includes([:name, :master_venue])

    render locals: { staff_without_email: staff_without_email }
  end

  def staff_members_without_ni_number
    authorize! :manage, :admin

    render locals: { staff_without_ni_number: StaffMembersWithoutNINumberQuery.new.all }
  end

  def staff_members_without_address
    authorize! :manage, :admin

    staff_without_address = StaffMembersWithoutAddressQuery.
      new.
      all.
      includes([:name, :master_venue])

    render locals: { staff_without_address: staff_without_address }
  end

  def staff_members_without_photo
    authorize! :manage, :admin

    staff_without_photo = StaffMembersWithoutPhotoQuery.new.all.includes([:name, :master_venue])

    render locals: { staff_without_photo: staff_without_photo }
  end
end
