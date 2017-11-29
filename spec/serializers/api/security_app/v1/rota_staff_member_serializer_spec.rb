require 'rails_helper'

RSpec.describe Api::SecurityApp::V1::RotaStaffMemberSerializer do
  let(:staff_member) { FactoryGirl.create(:staff_member, :security) }
  let(:json_result) { JSON.parse(described_class.new(staff_member).to_json) }


  specify 'should render json' do
    expect(json_result).to eq({
      "id" => staff_member.id,
      "firstName" => staff_member.name.first_name,
      "surname" => staff_member.name.surname,
      "avatarImageUrl" => staff_member.avatar_url,
      "preferredHoursNote" => staff_member.hours_preference_note,
      "preferredDaysNote" => staff_member.day_perference_note
    })
  end

  context 'staff member has preferred hours note' do
    before do
      staff_member.update_attributes!(hours_preference_note: nil)
    end

    specify 'should render nil for address fields' do
      expect(json_result.fetch("preferredHoursNote")).to eq(nil)
    end
  end

  context 'staff member has preferred days note' do
    before do
      staff_member.update_attributes!(day_perference_note: nil)
    end

    specify 'should render nil for address fields' do
      expect(json_result.fetch("preferredDaysNote")).to eq(nil)
    end
  end
end
