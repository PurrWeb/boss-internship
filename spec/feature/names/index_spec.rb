require 'feature/feature_spec_helper'

RSpec.feature 'Names index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:names_index_page) { PageObject::NamesIndexPage.new }

  before do
    login_as dev_user
  end

  scenario 'clicking `Names` in admin menu should take you to the names page' do
    names_index_page.surf_to
    names_index_page.assert_on_correct_page
  end
end
