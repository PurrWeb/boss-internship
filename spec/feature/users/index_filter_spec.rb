require 'feature/feature_spec_helper'

RSpec.feature 'Users index page filtering' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:users_index_page) { PageObject::UsersIndexPage.new }

  before do
    login_as(dev_user)
  end

  context 'filtering by role' do
    let(:dev_role)  { 'dev' }
    let!(:dev_users) { FactoryGirl.create_list(:user, 2, role: dev_role) }
    let(:manager_role) { 'manager' }
    let!(:managers) { FactoryGirl.create_list(:user, 3, role: manager_role) }
    let(:total_user_count) { 1 + dev_users.count + managers.count }

    scenario 'no filtering should be applied by default' do
      users_index_page.surf_to
      users_index_page.filter.tap do |filter|
        filter.ui_shows_filtering_by_role('Any')
        filter.ensure_records_returned(total_user_count)
      end
    end

    scenario 'filter settings should be persisted between updates' do
      users_index_page.surf_to
      users_index_page.filter.tap do |filter|
        filter.filter_by_role(dev_role)
        filter.ui_shows_filtering_by_role(dev_role)
      end
    end

    scenario 'filtering should effect results' do
      users_index_page.surf_to
      users_index_page.filter.tap do |filter|
        filter.filter_by_role(manager_role)
        filter.ensure_records_returned(managers.count)
      end
    end
  end
end
