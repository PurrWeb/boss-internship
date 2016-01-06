require 'feature/feature_spec_helper'

RSpec.feature 'Viewing a user' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:show_page) { PageObject::UserShowPage.new(admin_user) }

  before do
    login_as admin_user
  end

  scenario 'on the user show page all the user details should be displayed' do
    show_page.surf_to
    show_page.ensure_details_displayed_for(admin_user)
  end
end
