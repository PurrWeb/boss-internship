require 'feature/feature_spec_helper'

RSpec.feature 'Viewing a staff member' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:show_page) { PageObject::StaffMemberShowPage.new(staff_member) }
  let(:edit_employment_details_page) { PageObject::StaffMemberEditEmploymentDetailsPage.new(staff_member) }
  let(:edit_personal_details_page) { PageObject::StaffMemberEditPersonalDetailsPage.new(staff_member) }
  before do
    login_as dev_user
  end

  scenario 'on the staff show page all the user details should be displayed' do
    show_page.surf_to
    show_page.ensure_details_displayed_for(staff_member)
  end

  scenario 'on the staff show page you should see the staff members avatar photo' do
    show_page.surf_to
    show_page.ensure_avatar_image_displayed(image_url: staff_member.avatar.medium.url)
  end

  scenario 'clicking the edit button in the employment details section should
            take you to the edit employment details page' do
    show_page.surf_to
    show_page.click_edit_employment_details_button
    edit_employment_details_page.assert_on_correct_page
  end

  scenario 'clicking the edit button in the personal details section should
            take you to the edit personal details page' do
    show_page.surf_to
    show_page.click_edit_personal_details_button
    edit_personal_details_page.assert_on_correct_page
  end

  scenario 'page should have message explaining that no staff member has no associated user' do
    show_page.surf_to
    show_page.ensure_no_associated_user_message_displayed
  end

  context 'staff member has an associated user' do
    let(:user) { FactoryGirl.create(:user) }
    let(:user_show_page) { PageObject::UserShowPage.new(staff_member.user) }

    before do
      staff_member.update_attributes!(user: user)
    end

    scenario 'clicking on the view user link should take you to the user show page' do
      show_page.surf_to
      show_page.click_view_user_button
      user_show_page.assert_on_correct_page
    end
  end
end
