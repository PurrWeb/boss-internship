require 'rails_helper'

RSpec.describe Api::SecurityApp::V1::HolidaySerializer do
  let(:staff_member) { FactoryGirl.create(:staff_member, :security) }
  let(:holiday) { FactoryGirl.create(:holiday, staff_member: staff_member) }
  let(:json_result) { JSON.parse(described_class.new(holiday).to_json) }

  specify 'should render json' do
    expect(json_result).to eq({
      "id" => holiday.id,
      "staffMemberId" => staff_member.id,
      "startDate" => UIRotaDate.format(holiday.start_date),
      "endDate" => UIRotaDate.format(holiday.end_date)
    })
  end
end
