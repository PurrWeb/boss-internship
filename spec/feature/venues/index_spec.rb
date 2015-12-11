require 'feature/feature_spec_helper'

RSpec.feature 'Venues Section Index page' do
  let(:admin_user) { FactoryGirl.create(:user, :admin) }
  let(:venues_index_page) { VenuesIndexPage.new }
  let(:prospective_venue) { FactoryGirl.build(:venue, name: 'Party Place')}

  before do
    login_as(admin_user)
  end

  scenario 'the venues section should be highlighted in the navigaiton' do
    venues_index_page.surf_to
    venues_index_page.navigation.ensure_only_sections_highlighted(:venues)
  end


  scenario 'clicking add venues button takes you to the add venue page' do
    venues_index_page.surf_to
    venues_index_page.add_venue(prospective_venue)
    venues_index_page.ensure_flash_message_displayed('Venue added successfully')
    venue = Venue.find_by!(name: prospective_venue.name)
    venues_index_page.ensure_record_displayed_for(venue)
  end
end
