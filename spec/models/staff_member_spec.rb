require 'rails_helper'

describe StaffMember do
  let(:staff_member) { FactoryGirl.build(:staff_member) }

  describe 'avatar' do
    it 'should reject avatars of over 1MB in size' do
      staff_member.avatar = Rack::Test::UploadedFile.new(TestImageHelper.large_image_path)
      expect(staff_member).not_to be_valid
      expect(staff_member.errors[:avatar]).to eq(["file size must be less than 1 MB"])
    end
  end

  describe 'scopes' do
    describe 'StaffMember#for_venue' do
      let(:venue_1) { FactoryGirl.create(:venue) }
      let(:venue_1_staff_member) { FactoryGirl.create(:staff_member, venues: [venue_1]) }
      let(:venue_2) { FactoryGirl.create(:venue) }
      let(:venue_2_staff_member) { FactoryGirl.create(:staff_member, venues: [venue_2]) }

      it 'returns staff members assigned to the venue' do
        expect(StaffMember.for_venue(venue_1)).to eq([venue_1_staff_member])
        expect(StaffMember.for_venue(venue_2)).to eq([venue_2_staff_member])
      end
    end
  end
end
