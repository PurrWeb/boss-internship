require 'feature/feature_spec_helper'

RSpec.feature 'Disabling a staff member' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:user) { nil }
  let(:edited_staff_member) do
    FactoryGirl.create(
      :staff_member,
      user: user,
    )
  end
  let(:disable_staff_member_page) { PageObject::StaffMemberDisablePage.new(edited_staff_member) }
  let(:staff_member_show_page) { PageObject::StaffMemberShowPage.new(edited_staff_member) }

  before do
    edited_staff_member
    login_as dev_user
  end

  scenario "disable staff member from index page" do
    expect(edited_staff_member).to be_enabled
    staff_member_show_page.surf_to
    staff_member_show_page.click_disable_staff_member_button

    disable_staff_member_page.fill_in_disable_reason("Didn't like")
    disable_staff_member_page.submit_page

    staff_member_show_page.assert_on_correct_page
    expect(edited_staff_member).to be_disabled
  end

  scenario 'user disable warning message should not display' do
    disable_staff_member_page.surf_to
    disable_staff_member_page.ensure_user_disable_warning_message_not_displayed
  end

  context  'when staff member has associated user' do
    let(:user) { FactoryGirl.create(:user) }

    scenario 'user disable warning message should display' do
      disable_staff_member_page.surf_to
      disable_staff_member_page.ensure_user_disable_warning_message_displayed
    end
  end
end
