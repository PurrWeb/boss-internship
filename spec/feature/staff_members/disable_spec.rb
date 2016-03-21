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

  before do
    edited_staff_member
    login_as dev_user
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
