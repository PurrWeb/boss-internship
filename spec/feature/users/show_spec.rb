require 'feature/feature_spec_helper'

RSpec.feature 'Viewing a user' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:show_page) { PageObject::UserShowPage.new(admin_user) }
  let(:edit_personal_details_page) { PageObject::UserEditPersonalDetailsPage.new(admin_user) }

  before do
    login_as admin_user
  end

  scenario 'on the user show page all the user details should be displayed' do
    show_page.surf_to
    show_page.ensure_details_displayed_for(admin_user)
  end

  scenario 'clicking the edit button in the personal deatails section should
            take you to the edit personal details page' do
    show_page.surf_to
    show_page.click_edit_personal_details_button
    edit_personal_details_page.assert_on_correct_page
  end

  scenario 'page should have message explaining that user has no associated staff member' do
    show_page.surf_to
    show_page.ensure_no_associated_staff_member_message_displayed
  end

  context 'user has an associated staff member' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:staff_member_show_page) { PageObject::StaffMemberShowPage.new(admin_user.staff_member) }

    before do
      admin_user.update_attributes!(staff_member: staff_member)
    end

    scenario 'clicking on the view staff member link should take you to the staff member show page' do
      show_page.surf_to
      show_page.click_view_staff_member_button
      staff_member_show_page.assert_on_correct_page
    end
  end
end
