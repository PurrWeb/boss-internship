require 'feature/feature_spec_helper'

RSpec.feature 'Creating a venue' do
  let(:dev_user) { FactoryGirl.create(:user, :dev) }
  let(:add_venue_page) { PageObject::AddVenuePage.new }
  let(:venues_index_page) { PageObject::VenuesIndexPage.new }
  let(:prospective_venue) { FactoryGirl.build(:venue, name: 'Party Place')}
  let(:mock_ably_service) { double('ably service') }
  let(:default_questionnaire) { Questionnaire.create! }

  before do
    default_questionnaire
    allow(AblyService).to receive(:new).and_return(mock_ably_service)
    allow(mock_ably_service).to receive(:security_app_data_update)
    login_as(dev_user)
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
