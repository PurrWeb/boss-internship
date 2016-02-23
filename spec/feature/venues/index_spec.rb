require 'feature/feature_spec_helper'

RSpec.feature 'Venues Section Index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:venues_index_page) { PageObject::VenuesIndexPage.new }
  let(:prospective_venue) { FactoryGirl.build(:venue, name: 'Party Place')}
  let(:staff_member_index_page) { PageObject::StaffMembersIndexPage.new }
  let(:add_venue_page) { PageObject::AddVenuePage.new }

  before do
    login_as(dev_user)
  end

  scenario 'clicking add venues button takes you to the add venue page' do
    venues_index_page.surf_to
    venues_index_page.click_add_venue_button
    add_venue_page.assert_on_correct_page
  end

  context 'when venues exist' do
    let!(:venue) { FactoryGirl.create(:venue) }

    scenario 'the venues deatails should be displayed in the table' do
      venues_index_page.surf_to
      venues_index_page.venues_table.ensure_details_displayed_for(venue)
    end

    scenario 'clicking the staff count should take you to a pre filtered staff members index' do
      venues_index_page.surf_to
      venues_index_page.venues_table.click_on_detail(:staff_count, venue: venue)
      staff_member_index_page.filter.ui_shows_filtering_by_venue(venue)
    end
  end
end
