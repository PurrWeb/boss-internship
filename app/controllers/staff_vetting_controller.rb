class StaffVettingController < ApplicationController
  def index
    authorize! :manage, :admin

    staff_on_wrong_payrate_count = [
      StaffMemberWronglyOn18To21PayrateQuery,
      StaffMemberWronglyOn21To25PayrateQuery,
      StaffMemberWronglyOn25PlusPayrateQuery
    ].map do |query_class|
      query_class.new.all.count
    end.sum

    render locals: {
      staff_without_email_count: StaffMembersWithoutEmailQuery.new.all.count,
      staff_without_ni_number_count: StaffMembersWithoutNINumberQuery.new.all.count,
      staff_without_address_count: StaffMembersWithoutAddressQuery.new.all.count,
      staff_without_photo_count: StaffMembersWithoutPhotoQuery.new.all.count,
      staff_on_wrong_payrate_count: staff_on_wrong_payrate_count
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

  def staff_members_on_wrong_payrate
    authorize! :manage, :admin

    staff_wrongly_on_18_to_21_payrate = StaffMemberWronglyOn18To21PayrateQuery.new.
      all.
      includes([:name, :master_venue])
    staff_wrongly_on_21_to_25_payrate = StaffMemberWronglyOn21To25PayrateQuery.new.
      all.
      includes([:name, :master_venue])
    staff_wrongly_on_25_plus_payrate = StaffMemberWronglyOn25PlusPayrateQuery.new.
      all.
      includes([:name, :master_venue])

    render locals: {
      staff_wrongly_on_18_to_21_payrate: staff_wrongly_on_18_to_21_payrate,
      _18_21_section_id: "18-21",
      staff_wrongly_on_21_to_25_payrate: staff_wrongly_on_21_to_25_payrate,
      _21_25_section_id: "21-25",
      staff_wrongly_on_25_plus_payrate: staff_wrongly_on_25_plus_payrate,
      _25_plus_section_id: "25-plus"
    }
  end
end
