require 'feature/feature_spec_helper'

RSpec.feature 'Staff members section index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_members_index_page) { StaffMembersIndexPage.new }
  let(:add_staff_member_page) { AddStaffMemberPage.new }

  before do
    login_as(dev_user)
  end

  scenario 'the staff members section should be highlighted in the navigaiton' do
    staff_members_index_page.surf_to
    staff_members_index_page.navigation.ensure_only_sections_highlighted(:staff_members)
  end

  scenario 'clicking add new staff member button takes you to the add staff members page' do
    staff_members_index_page.surf_to
    staff_members_index_page.click_add_staff_member_button
    add_staff_member_page.assert_on_correct_page
  end

  context 'staff members exist' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    before do
      staff_member
    end

    scenario 'staff member details should be displayed in a table' do
      staff_members_index_page.surf_to
      staff_members_index_page.staff_members_table.ensure_details_displayed_for(staff_member)
    end
  end
end
