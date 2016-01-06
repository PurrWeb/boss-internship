require 'feature/feature_spec_helper'

RSpec.feature 'Creating a venue' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:add_venue_page) { AddVenuePage.new }
  let(:venues_index_page) { VenuesIndexPage.new }
  let(:prospective_venue) { FactoryGirl.build(:venue, name: 'Party Place')}

  before do
    login_as(dev_user)
  end

  scenario 'the admin section should be highlighted in the navigaiton' do
    add_venue_page.surf_to
    add_venue_page.navigation.ensure_top_level_sections_highlighted(:admin)
  end

  scenario 'successfully adding a new venue to the system' do
    add_venue_page.surf_to
    add_venue_page.fill_and_submit_form_for(prospective_venue)

    venues_index_page.ensure_flash_success_message_displayed('Venue added successfully')
    venue = Venue.find_by!(name: prospective_venue.name)
    venues_index_page.ensure_record_displayed_for(venue)
  end

  context 'name already exists' do
    let!(:existing_venue) { FactoryGirl.create(:venue, name: prospective_venue.name) }

    scenario 'Attempt to create venue with same name as existing' do
      expect(Venue.count).to eq(1)
      add_venue_page.surf_to

      add_venue_page.fill_and_submit_form_for(prospective_venue)
      add_venue_page.ensure_flash_error_message_displayed('There was a problem creating this venue')
      expect(Venue.count).to eq(1)
    end
  end
end
