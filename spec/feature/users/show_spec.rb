require 'feature/feature_spec_helper'

RSpec.feature 'Viewing a user' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:show_page) { PageObject::UserShowPage.new(dev_user) }
  let(:edit_personal_details_page) { PageObject::UserEditPersonalDetailsPage.new(dev_user) }
  let(:edit_access_details_page) { PageObject::UserEditAccessDetailsPage.new(dev_user) }
  let(:create_staff_member_from_user_page) { PageObject::CreateStaffMemberFromUserPage.new(dev_user) }

  before do
    login_as dev_user
  end

  scenario 'on the user show page all the user details should be displayed' do
    show_page.surf_to
    show_page.ensure_details_displayed_for(dev_user)
  end

  scenario 'clicking the edit button in the personal deatails section should
            take you to the edit personal details page' do
    show_page.surf_to
    show_page.click_edit_personal_details_button
    edit_personal_details_page.assert_on_correct_page
  end

  scenario 'clicking the edit button in the access deatails section should
            take you to the edit access details page' do
    show_page.surf_to
    show_page.click_edit_access_details_button
    edit_access_details_page.assert_on_correct_page
  end

  scenario 'page should have message explaining that user has no associated staff member' do
    show_page.surf_to
    show_page.ensure_no_associated_staff_member_message_displayed
  end

  scenario 'clicking the create staff member link takes you to the create staff member from user page' do
    show_page.surf_to
    show_page.click_create_staff_member_link
    create_staff_member_from_user_page.assert_on_correct_page
  end

  context 'user has an associated staff member' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:staff_member_profile_page) { PageObject::StaffMemberProfilePage.new(dev_user.staff_member) }

    before do
      dev_user.update_attributes!(staff_member: staff_member)
    end

    scenario 'clicking on the view staff member link should take you to the staff member show page' do
      show_page.surf_to
      show_page.click_view_staff_member_button
      staff_member_profile_page.assert_on_correct_page
    end
  end
end
