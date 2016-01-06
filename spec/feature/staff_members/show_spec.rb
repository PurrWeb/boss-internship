require 'feature/feature_spec_helper'

RSpec.feature 'Viewing a staff member' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:show_page) { PageObject::StaffMemberShowPage.new(staff_member) }

  before do
    login_as admin_user
  end

  scenario 'on the staff show page all the user details should be displayed' do
    show_page.surf_to
    show_page.ensure_details_displayed_for(staff_member)
  end

  scenario 'on the staff show page you should see the staff members avatar photo' do
    show_page.surf_to
    show_page.ensure_avatar_image_displayed(image_url: staff_member.avatar.medium.url)
  end
end
