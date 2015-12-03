
require 'feature/feature_spec_helper'

RSpec.feature 'Users Section Index page' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:users_index_page) { UsersIndexPage.new }

  before do
    login_as(admin_user)
  end

  scenario 'the users section should be highlighted in the navigaiton' do
    users_index_page.surf_to
    users_index_page.navigation.ensure_only_sections_highlighted(:users)
  end
end
