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
end
