require "rails_helper"

RSpec.describe 'Dashboard Request Specs', type: :request do
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:admin_user) { FactoryGirl.create(:user, role: 'admin') }
  let!(:maintenance_staff_user) { FactoryGirl.create(:user, venues: [venue], role: 'maintenance_staff') }
  let!(:dashboard_message_one) { FactoryGirl.create(:dashboard_message, title: '1st', created_by_user: admin_user, published_time: Time.now, venues: [venue]) }
  let!(:dashboard_message_two) { FactoryGirl.create(:dashboard_message, title: '2nd', created_by_user: admin_user, published_time: Time.now, venues: [venue]) }

  describe '#index' do
    it 'Returns 401 error if token is invalid' do
      get "/api/v1/dashboard_messages", {}, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns data in correct order' do
      get "/api/v1/dashboard_messages", { venue_id: venue.id }, token_header(admin_user)

      dashboard_message_json = JSON.parse(response.body)['dashboardMessages']

      expect(response.status).to eq(200)
      expect(dashboard_message_json.length).to eq(2)
      expect(dashboard_message_json.first.fetch('title')).to eq('2nd')
      expect(dashboard_message_json.last.fetch('title')).to eq('1st')
    end
  end

  describe '#update' do
    it 'Raises cancan access denied error if user does not have permission' do
      expect do
        put "/api/v1/dashboard_messages/#{dashboard_message_one.id}", {}, token_header(maintenance_staff_user)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      put "/api/v1/dashboard_messages/#{dashboard_message_one.id}", {}, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when validations fail' do
      published_time = Time.now

      attributes = {
        to_all_venues: false,
        title: '',
        message: '',
        published_time: '',
        venue_ids: [venue.id]
      }

      put "/api/v1/dashboard_messages/#{dashboard_message_one.id}", attributes, token_header(admin_user)

      dashboard_message_errors_json = JSON.parse(response.body).fetch('errors')

      expect(response.status).to eq(422)
      expect(dashboard_message_errors_json.fetch('title')).to eq(["can't be blank"])
      expect(dashboard_message_errors_json.fetch('message')).to eq(["can't be blank"])
      expect(dashboard_message_errors_json.fetch('publishedTime')).to eq(["can't be blank"])
    end

    it 'creates a maintenance task when all attributes are passed and token is valid' do
      published_time = Time.now
      attributes = {
        venue_id: venue.id,
        title: 'Updated Title',
        message: 'Updated message',
        to_all_venues: true,
        published_time: Time.now
      }

      put "/api/v1/dashboard_messages/#{dashboard_message_one.id}", attributes, token_header(admin_user)

      dashboard_message_json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(dashboard_message_json.fetch('title')).to eq('Updated Title')
      expect(dashboard_message_json.fetch('message')).to eq('Updated message')
      expect(dashboard_message_json.fetch('toAllVenues')).to eq(true)
    end
  end

  describe '#create' do
    it 'Raises cancan access denied error if user does not have permission' do
      expect do
        post '/api/v1/dashboard_messages', {}, token_header(maintenance_staff_user)
      end.to raise_error(CanCan::AccessDenied)
    end

    it 'Returns 401 error if token is invalid' do
      post '/api/v1/dashboard_messages', {}, invalid_token_header

      expect(response.status).to eq(401)
    end

    it 'returns unprocessible entity when validations fail' do
      attributes = {
        to_all_venues: false,
        title: '',
        message: '',
        published_time: '',
        venue_ids: [venue.id]
      }

      post '/api/v1/dashboard_messages', attributes, token_header(admin_user)

      dashboard_message_errors_json = JSON.parse(response.body).fetch('errors')

      expect(response.status).to eq(422)
      expect(dashboard_message_errors_json.fetch('title')).to eq(["can't be blank"])
      expect(dashboard_message_errors_json.fetch('message')).to eq(["can't be blank"])
      expect(dashboard_message_errors_json.fetch('publishedTime')).to eq(["can't be blank"])
    end

    it 'creates a maintenance task when all attributes are passed and token is valid' do
      attributes = {
        to_all_venues: false,
        title: 'Title',
        message: 'Message',
        published_time: Time.now,
        venue_ids: [venue.id]
      }

      post '/api/v1/dashboard_messages', attributes, token_header(admin_user)

      dashboard_message_json = JSON.parse(response.body)

      expect(response.status).to eq(201)
      expect(dashboard_message_json.fetch('title')).to eq('Title')
      expect(dashboard_message_json.fetch('message')).to eq('Message')
      expect(dashboard_message_json.fetch('toAllVenues')).to eq(false)
    end
  end
end
