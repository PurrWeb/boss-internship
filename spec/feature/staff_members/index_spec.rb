require 'feature/feature_spec_helper'

RSpec.feature 'Staff members section index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_members_index_page) { PageObject::StaffMembersIndexPage.new }
  let(:add_staff_member_page) { PageObject::AddStaffMemberPage.new }

  before do
    login_as(dev_user)
  end

  scenario 'clicking add new staff member button takes you to the add staff members page' do
    staff_members_index_page.surf_to
    staff_members_index_page.click_add_staff_member_button
    add_staff_member_page.assert_on_correct_page
  end

  context 'staff members exist' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:staff_member_show_page) { PageObject::StaffMemberShowPage.new(staff_member) }

    before do
      staff_member
    end

    scenario 'staff member details should be displayed in a table' do
      staff_members_index_page.surf_to
      staff_members_index_page.staff_members_table.ensure_details_displayed_for(staff_member)
    end

    scenario 'clicking on a staff memebers details should take you to their show page' do
      PageObject::StaffMembersIndexTable.columns.each do |column|
        staff_members_index_page.surf_to
        staff_members_index_page.staff_members_table.click_on_detail(column, staff_member: staff_member)
        staff_member_show_page.assert_on_correct_page
      end
    end
  end
end
