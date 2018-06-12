require 'rails_helper'

RSpec.describe Api::SecurityApp::V1::RotaShiftSerializer do
  let(:staff_member) { FactoryGirl.create(:staff_member, :security) }
  let(:rota_shift) { FactoryGirl.create(:rota_shift, staff_member: staff_member) }
  let(:json_result) { JSON.parse(described_class.new(rota_shift).to_json) }

  specify 'should render json' do
    expect(json_result).to eq({
      "id" => rota_shift.id,
      "staffMemberId" => staff_member.id,
      "venueId" => rota_shift.venue.id,
      "venueType" => rota_shift.venue.venue_type,
      "date" => UIRotaDate.format(rota_shift.date),
      "shiftType" => rota_shift.shift_type,
      "startsAt" => rota_shift.starts_at.utc.iso8601,
      "endsAt" => rota_shift.ends_at.utc.iso8601
    })
  end
end
