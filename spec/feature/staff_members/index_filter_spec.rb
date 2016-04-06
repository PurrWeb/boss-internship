require 'feature/feature_spec_helper'

RSpec.feature 'Staff members index page filtering' do
  let(:user) { FactoryGirl.create(:user, :dev) }
  let(:staff_members_index_page) { PageObject::StaffMembersIndexPage.new }

  before do
    login_as(user)
  end

  context 'filtering by staff type' do
    let(:bar_staff_type) { FactoryGirl.create(:staff_type, name: 'Bar Staff') }
    let(:bar_staff_members) { FactoryGirl.create_list(:staff_member, 2, staff_type: bar_staff_type) }
    let(:security_staff_type) { FactoryGirl.create(:staff_type, name: 'Security') }
    let(:security_staff_members) { FactoryGirl.create_list(:staff_member, 3, staff_type: security_staff_type) }
    let(:total_staff_member_count) { security_staff_members.count + bar_staff_members.count }

    before do
      bar_staff_members
      security_staff_members
    end

    scenario 'no filtering should be applied by default' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.ui_shows_filtering_by_staff_type(nil)
        filter.ensure_records_returned(total_staff_member_count)
      end
    end

    scenario 'filter settings should be persisted between updates' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.filter_by_staff_type(security_staff_type)
        filter.ui_shows_filtering_by_staff_type(security_staff_type)
      end
    end

    scenario 'filtering should effect results' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.filter_by_staff_type(security_staff_type)
        filter.ensure_records_returned(security_staff_members.count)
      end
    end
  end

  context 'filtering by venue' do
    let!(:venue_1) { FactoryGirl.create('venue') }
    let!(:venue_2) { FactoryGirl.create('venue') }
    let!(:venue_1_staff) do
      FactoryGirl.create_list(:staff_member, 2, venues: [venue_1])
    end
    let!(:venue_2_staff) do
      FactoryGirl.create_list(:staff_member, 3, venues: [venue_2])
    end
    let(:total_staff_member_count) { venue_1_staff.count + venue_2_staff.count }

    scenario 'no filtering should be applied by default' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.ui_shows_filtering_by_venue(nil)
        filter.ensure_records_returned(total_staff_member_count)
      end
    end

    scenario 'filter settings should be persisted between updates' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.filter_by_venue(venue_1)
        filter.ui_shows_filtering_by_venue(venue_1)
      end
    end

    scenario 'filtering should effect results' do
      staff_members_index_page.surf_to
      staff_members_index_page.filter.tap do |filter|
        filter.filter_by_venue(venue_2)
        filter.ensure_records_returned(venue_2_staff.count)
      end
    end
  end

  context 'user is security manager' do
    let(:user) { FactoryGirl.create(:user, :security_manager) }

    context 'when staff exist'do
      let(:bar_staff_type) { FactoryGirl.create(:staff_type, name: 'Bar Staff') }
      let(:bar_staff_members) { FactoryGirl.create_list(:staff_member, 2, staff_type: bar_staff_type) }
      let(:security_staff_type) { FactoryGirl.create(:security_staff_type) }
      let(:security_staff_members) { FactoryGirl.create_list(:staff_member, 3, :security, staff_type: security_staff_type) }
      let(:total_staff_member_count) { security_staff_members.count + bar_staff_members.count }

      before do
        security_staff_members
        bar_staff_members
      end

      scenario 'only security staff records should be displayed' do
        staff_members_index_page.surf_to
        staff_members_index_page.staff_members_table.tap do |table|
          security_staff_members.map(&:reload).each do |staff_member|
            table.ensure_details_displayed_for(staff_member)
          end
          bar_staff_members.each do |staff_member|
            table.ensure_record_not_displayed_for(staff_member)
          end
        end
      end
    end
  end
end
