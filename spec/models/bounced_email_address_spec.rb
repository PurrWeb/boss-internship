require 'rails_helper'

RSpec.describe "Bounced email address " do
  let(:email) { "test@test.com" }
  let(:reason) { "some reason" }
  let(:bounced_at) { "some date" }
  let(:error_code) { "some code" }
  let(:valid_data) { [{email: email, reason: reason, bounced_at: bounced_at, error_code: error_code}] }
  let(:invalid_data) { [{email: "", bounced_at: "", error_code: ""}] }
  let(:model) {BouncedEmailAddress}
  let(:clear) {model.clear}

  specify 'data should be valid' do
    expect(model.bounce_data_valid?(bounce_data: valid_data)).to eq(true)
  end

  specify 'data should be invalid' do
    expect(model.bounce_data_valid?(bounce_data: invalid_data)).to eq(false)
  end

  specify 'bounced database should be empty' do
    expect(model.all.size).to eq(0)
  end

  context 'update ' do
    before do
      model.update(bounce_data: valid_data)
    end

    specify 'record should be created after update ' do
      expect(model.find_by_email(email: email)).to eq({
        "email" => email,
        "reason" => reason,
        "bounced_at" => bounced_at,
        "error_code" => error_code,
        "updated_at" => model.update_time,
      })
      expect(model.all.size).to eq(1)
    end
    specify 'bounced database should be empty after clear ' do
      clear
      expect(model.all.size).to eq(0)
    end
  end
end
