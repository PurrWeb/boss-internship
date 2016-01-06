require 'feature/feature_spec_helper'

RSpec.feature 'Venues Section Index page' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:venues_index_page) { VenuesIndexPage.new }
  let(:prospective_venue) { FactoryGirl.build(:venue, name: 'Party Place')}
  let(:staff_member_index_page) { StaffMembersIndexPage.new }

  before do
    login_as(dev_user)
  end

  scenario 'the admin section should be highlighted in the navigaiton' do
    venues_index_page.surf_to
    venues_index_page.navigation.ensure_top_level_sections_highlighted(:admin)
  end


  scenario 'clicking add venues button takes you to the add venue page' do
    venues_index_page.surf_to
    venues_index_page.add_venue(prospective_venue)
    venues_index_page.ensure_flash_success_message_displayed('Venue added successfully')
    venue = Venue.find_by!(name: prospective_venue.name)
    venues_index_page.ensure_record_displayed_for(venue)
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
