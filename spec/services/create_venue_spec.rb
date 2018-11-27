require 'rails_helper'

describe CreateVenue do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:start_of_day) { RotaShiftDate.new(today).start_time }
  let(:current_week) { RotaWeek.new(today) }
  let(:call_time) { start_of_day + 10.hours }
  let(:user) { FactoryGirl.create(:user) }
  let(:reminder_users) { [] }
  let(:service) do
    CreateVenue.new(
      requester: user,
      params: create_params,
      reminder_users: reminder_users
    )
  end
  let(:call_service) { service.call }
  let(:result) { call_service }
  let(:default_questionnaire) { Questionnaire.create! }

  before do
    default_questionnaire
  end

  describe 'creating venue' do
    let(:fruit_order_fields) { FruitOrder::FIELDS.first(5) }
    let(:venue_name) { 'venue_name' }
    let(:till_float_cents) { 100000 }
    let(:safe_float_cents) { 5000 }
    let(:change_order_site_id) { 'change_order_site_id' }
    let(:latitude) { 23.34 }
    let(:longitude) { 3.3 }
    let(:create_params) do
      {
        name: venue_name,
        fruit_order_fields: fruit_order_fields,
        till_float_cents: till_float_cents,
        safe_float_cents: safe_float_cents,
        change_order_site_id: change_order_site_id,
        latitude: latitude,
        longitude: longitude
      }
    end

    it 'should succeed' do
      call_service
      expect(result.success?).to eq(true)
    end

    it 'should have default questionnaire assigned to it' do
      call_service
      expect(result.venue.questionnaires.count).to eq(1)
      expect(result.venue.questionnaires.first).to eq(default_questionnaire)
    end

    it 'should create the venue with supplied values' do
      call_service
      venue = result.venue
      expect(venue).to be_persisted
      venue.reload
      expect(venue.name).to eq(venue_name)
      expect(venue.fruit_order_fields).to eq(fruit_order_fields)
      expect(venue.till_float_cents).to eq(till_float_cents)
      expect(venue.safe_float_cents).to eq(safe_float_cents)
      expect(venue.latitude).to eq(latitude)
      expect(venue.longitude).to eq(longitude)
      expect(venue.change_order_site_id).to eq(change_order_site_id)
    end
  end
end
