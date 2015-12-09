require 'feature/feature_spec_helper'

RSpec.feature 'Adding a new staff member' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:prospective_staff_member) { FactoryGirl.build(:staff_member) }
  let(:add_staff_member_page) { AddStaffMemberPage.new }
  let(:staff_members_index_page) { StaffMembersIndexPage.new }

  before do
    login_as admin_user
  end

  scenario 'Successfully adding a new user to the system' do
    add_staff_member_page.surf_to

    add_staff_member_page.form.tap do |form|
      form.fill_in_for(prospective_staff_member)
      form.submit
    end

    staff_members_index_page.ensure_flash_message_displayed('Staff member added successfully')
    staff_member = StaffMember.find_by!(email: prospective_staff_member.email)
    staff_members_index_page.ensure_record_displayed_for(staff_member)
  end
end
