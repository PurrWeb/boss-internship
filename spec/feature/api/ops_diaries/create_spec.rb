require 'rails_helper'

RSpec.describe 'Create OpsDiary API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :ops_manager) }
  let(:diary_priority_medium) do
    'medium'
  end
  let(:title) do
    "Some title"
  end
  let(:text) do
    "Some text"
  end
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_ops_diaries_path
  end
  let(:response) do
    post(url, params)
  end
  let(:valid_params) do
    {
      venueId: venue.id,
      title: title,
      priority: diary_priority_medium,
      text: text
    }
  end

  context 'before call' do
    it 'no ops diaries should exist for venue' do
      expect(venue.ops_diaries.count).to eq(0)
    end
  end

  context 'creating accessory for venue' do
    context ' with valid params' do
      let(:params) do
        valid_params
      end

      before do
        response
      end

      it 'should return ok status' do
        expect(response.status).to eq(ok_status)
      end

      it 'it should create ops diary' do
        expect(venue.ops_diaries.count).to eq(1)
        expect(venue.ops_diaries.first.title).to eq(title)
        expect(venue.ops_diaries.first.priority).to eq(diary_priority_medium)
        expect(venue.ops_diaries.first.text).to eq(text)
        expect(venue.ops_diaries.first.venue).to eq(venue)
        expect(venue.ops_diaries.first.created_by_user).to eq(user)
      end

      it 'it should return created ops diary' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "id" => venue.ops_diaries.first.id,
          "title" => venue.ops_diaries.first.title,
          "text" => venue.ops_diaries.first.text,
          "priority" => venue.ops_diaries.first.priority,
          "venueId" => venue.ops_diaries.first.venue_id,
          "createdByUserId" => venue.ops_diaries.first.created_by_user_id,
        })
      end
    end

    context ' with empty params' do
      let(:params) do
        valid_params.merge({
          title: '',
          text: '',
          priority: '',
          venueId: ''
        })
      end

      before do
        response
      end

      it 'should return unprocessable_entity status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'it shouldn\'t create ops diary' do
        expect(venue.accessories.count).to eq(0)
      end

      it 'should return errors json' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "title" => ["can't be blank"],
            "text" => ["can't be blank"],
            "venue"=>["can't be blank"],
            "priority"=>["can't be blank"]
          }
        })
      end
    end
  end

  private
  def app
    Rails.application
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

  def ok_status
    200
  end

  def unprocessable_entity_status
    422
  end
end
