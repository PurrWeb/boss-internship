require 'rails_helper'

RSpec.describe Api::SecurityApp::V1::ProfileStaffMemberSerializer do
  let(:staff_member) { FactoryGirl.create(:staff_member, :security) }
  let(:json_result) { JSON.parse(described_class.new(staff_member).to_json) }


  specify 'should render json' do
    expect(json_result).to eq({
      "id" => staff_member.id,
      "firstName" => staff_member.name.first_name,
      "surname" => staff_member.name.surname,
      "email" => staff_member.email,
      "avatarImageUrl" => staff_member.avatar_url,
      "phoneNumber" => staff_member.phone_number,
      "niNumber" => staff_member.national_insurance_number,
      "dateOfBirth" => UIRotaDate.format(staff_member.date_of_birth),
      "siaBadgeExpiryDate" => UIRotaDate.format(staff_member.sia_badge_expiry_date),
      "siaBadgeNumber" => staff_member.sia_badge_number,
      "address" => staff_member.address.address,
      "county" => staff_member.address.county,
      "country" => staff_member.address.country,
      "postcode" => staff_member.address.postcode
    })
  end

  context 'staff member has no address' do
    before do
      staff_member.update_attributes!(address: nil)
    end

    specify 'should render nil for address fields' do
      expect(json_result.fetch("address")).to eq(nil)
      expect(json_result.fetch("country")).to eq(nil)
      expect(json_result.fetch("county")).to eq(nil)
      expect(json_result.fetch("postcode")).to eq(nil)
    end
  end

  context 'staff member has no phone number' do
    before do
      staff_member.update_attributes!(phone_number: nil)
    end

    specify 'should render nil for phone numbmer field' do
      expect(json_result.fetch("phoneNumber")).to eq(nil)
    end
  end

  context 'staff member has no national insurance number listed' do
    before do
      staff_member.update_attributes!(national_insurance_number: nil)
    end

    specify 'should render nil for phone numbmer field' do
      expect(json_result.fetch("niNumber")).to eq(nil)
    end
  end
end
