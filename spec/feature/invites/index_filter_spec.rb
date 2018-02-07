require 'feature/feature_spec_helper'

RSpec.feature 'Staff members index page filtering' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:invites_index_page) { PageObject::InvitesIndexPage.new }

  before do
    login_as(dev_user)
  end

  context 'filtering by status' do
    let!(:open_invites) { FactoryGirl.create_list(:invite, 2, inviter: dev_user) }
    let!(:revoked_invites) { FactoryGirl.create_list(:invite, 3, :revoked, inviter: dev_user) }
    let(:total_invite_count) { open_invites.count + revoked_invites.count }

    scenario 'filtering by open status by default' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.ui_shows_filtering_by_status(:open)
        filter.ensure_records_returned(open_invites.count)
      end
    end

    scenario 'filtering by Any status should return all records' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.filter_by_status('Any')
        filter.ui_shows_filtering_by_status('Any')
        filter.ensure_records_returned(total_invite_count)
      end
    end

    scenario 'filter settings should be persisted between updates' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.filter_by_status(:revoked)
        filter.ui_shows_filtering_by_status(:revoked)
      end
    end

    scenario 'filtering should effect results' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.filter_by_status(:revoked)
        filter.ensure_records_returned(revoked_invites.count)
      end
    end
  end

  context 'filtering by role' do
    let!(:admin_role) { 'admin' }
    let!(:admin_role_invites) do
      FactoryGirl.create_list(:invite, 2, role: User::ADMIN_ROLE, inviter: dev_user)
    end
    let!(:manager_role_invites) do
      FactoryGirl.create_list(:invite, 3, role: User::MANAGER_ROLE, inviter: dev_user)
    end
    let(:total_invite_count) { admin_role_invites.count + manager_role_invites.count }

    scenario 'no filtering should be applied by default' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.ui_shows_filtering_by_role(nil)
        filter.ensure_records_returned(total_invite_count)
      end
    end

    scenario 'filter settings should be persisted between updates' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.filter_by_role(admin_role)
        filter.ui_shows_filtering_by_role(admin_role)
      end
    end

    scenario 'filtering should effect results' do
      invites_index_page.surf_to
      invites_index_page.filter.tap do |filter|
        filter.filter_by_role(User::MANAGER_ROLE)
        filter.ensure_records_returned(manager_role_invites.count)
      end
    end
  end
end
