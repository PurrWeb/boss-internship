require 'rails_helper'

RSpec.describe 'Update OpsDiary API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, :ops_manager) }
  let(:old_diary_priority) { 'high' }
  let(:new_diary_priority) { 'medium' }
  let(:old_title) { 'old title' }
  let(:new_title) { "new title" }
  let(:old_text) { 'old text' }
  let(:new_text) { "new text" }
  let(:now) { Time.current }
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:ops_diary) do
    FactoryGirl.create(
      :ops_diary,
      venue: venue,
      created_by_user: user,
      priority: old_diary_priority,
      text: old_text,
      title: old_title
    )
  end
  let(:url) do
    url_helpers.api_v1_ops_diary_path(ops_diary)
  end
  let(:response) do
    put(url, params)
  end
  let(:valid_params) do
    {
      title: new_title,
      priority: new_diary_priority,
      text: new_text
    }
  end
  let(:perform_call) do
    response
    nil
  end

  context 'Ops diary exists' do
    before do
      ops_diary
    end

    context ' with valid params' do
      let(:params) do
        valid_params
      end

      context 'before call' do
        it 'diary should exist' do
          expect(venue.ops_diaries.count).to eq(1)
        end
      end

      it 'should return ok status' do
        expect(response.status).to eq(ok_status)
      end

      it 'it should update ops diary model' do
        perform_call

        ops_diary.reload
        expect(ops_diary.title).to eq(new_title)
        expect(ops_diary.priority).to eq(new_diary_priority)
        expect(ops_diary.text).to eq(new_text)
      end

      it 'it should return updated ops diary' do
        json = JSON.parse(response.body)

        ops_diary.reload
        expect(json).to eq({
          "id" => ops_diary.id,
          "title" => new_title,
          "text" => new_text,
          "priority" => new_diary_priority,
          "venueId" => ops_diary.venue.id,
          "createdByUserId" => ops_diary.created_by_user_id,
          "createdAt" => ops_diary.created_at.utc.iso8601,
          "active" => ops_diary.enabled? ? true : false
        })
      end
    end

    context ' with empty params' do
      let(:params) do
        valid_params.merge({
          title: '',
          text: '',
          priority: ''
        })
      end

      before do
        response
      end

      it 'should return unprocessable_entity status' do
        expect(response.status).to eq(unprocessable_entity_status)
      end

      it 'should return errors json' do
        json = JSON.parse(response.body)
        expect(json).to eq({
          "errors" => {
            "title" => ["can't be blank"],
            "text" => ["can't be blank"],
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
