require 'feature/feature_spec_helper'

RSpec.feature 'Adding a new user' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:prospective_user) { FactoryGirl.build(:user) }
  let(:add_staff_member_page) { AddUserPage.new }
  let(:user_index_page) { UsersIndexPage.new }

  before do
    login_as admin_user
  end

  scenario 'Successfully adding a new user to the system' do
    add_staff_member_page.surf_to

    add_staff_member_page.form.tap do |form|
      form.fill_in_for(prospective_user)
      form.submit
    end

    user_index_page.ensure_flash_message_displayed('User added successfully')
    user = User.joins(:email_address).merge(EmailAddress.where(email: prospective_user.email)).first
    user_index_page.ensure_record_displayed_for(user)
  end
end
