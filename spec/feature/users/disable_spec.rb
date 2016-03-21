require 'feature/feature_spec_helper'

RSpec.feature 'Disabling a user' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:staff_member) { nil }
  let(:edited_user) do
    FactoryGirl.create(
      :user,
      staff_member: staff_member,
    )
  end
  let(:disable_user_page) { PageObject::UserDisablePage.new(edited_user) }

  before do
    edited_user
    login_as dev_user
  end

  scenario 'staff member disable warning message should not be displayed' do
    disable_user_page.surf_to
    disable_user_page.ensure_staff_member_disable_warning_message_not_displayed
  end

  context  'when user has associated staff member' do
    let(:staff_member) { FactoryGirl.create(:staff_member) }

    scenario 'staff member disable warning message should be displayed' do
      disable_user_page.surf_to
      disable_user_page.ensure_staff_member_disable_warning_message_displayed
    end
  end
end
