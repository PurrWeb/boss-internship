require 'rails_helper'

RSpec.describe 'Update owed hour API endpoint' do
  include Rack::Test::Methods
  include HeaderHelpers
  include ActiveSupport::Testing::TimeHelpers

  before do
    set_authorization_header(access_token.token)
  end

  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
    )
  end
  let(:venue) { staff_member.master_venue }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }
  let(:old_date) do
    (now - 1.week).to_date
  end
  let(:old_starts_at) do
    RotaShiftDate.new(old_date).start_time
  end
  let(:old_ends_at) do
    RotaShiftDate.new(old_date).start_time + 40.minutes
  end
  let(:new_date) do
    (now - 2.week).to_date
  end
  let(:new_starts_at_offset) do
    0
  end
  let(:new_ends_at_offset) do
    145
  end
  let(:new_starts_at) do
    RotaShiftDate.new(new_date).start_time + new_starts_at_offset.minutes
  end
  let(:new_ends_at) do
    RotaShiftDate.new(new_date).start_time + new_ends_at_offset.minutes
  end
  let(:now) { Time.current }
  let(:owed_hour) do
    FactoryGirl.create(
      :owed_hour,
      staff_member: staff_member,
      date: old_date,
      starts_at: old_starts_at,
      ends_at: old_ends_at,
    )
  end
  let(:access_token) do
    WebApiAccessToken.new(
      expires_at: 30.minutes.from_now,
      user: user
    ).persist!
  end
  let(:url) do
    url_helpers.api_v1_staff_member_owed_hour_path(staff_member, owed_hour)
  end
  let(:response) do
    put(url, params)
  end
  let(:valid_params) do
    {
      date: new_date.strftime('%d-%m-%Y'),
      startsAt: new_starts_at_offset,
      endsAt: new_ends_at_offset,
      note: "TEST"
    }
  end
  let(:empty_params) do
    {
      date: nil,
      startsAt: nil,
      endsAt: nil,
      note: nil
    }
  end
  
  context 'when empty params supplied' do
    let(:params) do
      empty_params
    end

    before do
      response
    end
    
    it 'should return validation errors' do
      json = JSON.parse(response.body)

      expect(json["errors"]["date"]).to eq(["can't be blank"])
      expect(json["errors"]["startsAt"]).to eq(["can't be blank"])
      expect(json["errors"]["endsAt"]).to eq(["can't be blank"])
    end
  end

  context 'when valid params supplied' do
    let(:params) do
      valid_params
    end
    
    before do
      response
    end

    it 'should return ok status' do
      expect(response.status).to eq(ok_status)
    end

    it 'should have updated the holiday' do
      owed_hour.reload
      expect(owed_hour.disabled?).to eq(true)
      expect(owed_hour.parent.present?).to eq(true)
      expect(owed_hour.parent.date).to eq(new_date)
      expect(owed_hour.parent.starts_at).to eq(new_starts_at)
      expect(owed_hour.parent.ends_at).to eq(new_ends_at)
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
