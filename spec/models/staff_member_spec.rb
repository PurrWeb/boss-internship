require 'rails_helper'

describe StaffMember do
  let(:now) { Time.current }
  let(:staff_member) { FactoryGirl.build(:staff_member) }

  describe 'avatar' do
    it 'should reject avatars of over 1MB in size' do
      staff_member.avatar = Rack::Test::UploadedFile.new(TestImageHelper.large_image_path)
      expect(staff_member).not_to be_valid
      expect(staff_member.errors[:avatar]).to eq(["file size must be less than 1 MB"])
    end
  end

  describe 'scopes' do
    describe 'StaffMember#can_have_finance_reports' do
      context 'staff member is not security' do
        let!(:existing_staff_member) do
          FactoryGirl.create(:staff_member)
        end

        it 'should be returned' do
          expect(
            StaffMember.can_have_finance_reports
          ).to include(existing_staff_member)
        end
      end

      context 'staff member is not security' do
        let!(:existing_staff_member) do
          FactoryGirl.create(:staff_member, :security)
        end

        it 'should not be returned' do
          expect(
            StaffMember.can_have_finance_reports
          ).to_not include(existing_staff_member)
        end
      end
    end

    describe 'StaffMember#for_venue' do
      context 'with matching master venues' do
        let(:venue_1) { FactoryGirl.create(:venue) }
        let(:venue_1_staff_member) { FactoryGirl.create(:staff_member, master_venue: venue_1) }
        let(:venue_2) { FactoryGirl.create(:venue) }
        let(:venue_2_staff_member) { FactoryGirl.create(:staff_member, master_venue: venue_2) }

        before do
          venue_1_staff_member
          venue_2_staff_member
        end

        it 'returns staff members assigned to the venue' do
          expect(StaffMember.for_venue(venue_1)).to eq([venue_1_staff_member])
          expect(StaffMember.for_venue(venue_2)).to eq([venue_2_staff_member])
        end
      end

      context 'with matching work venues' do
        let(:master_venue) { FactoryGirl.create(:venue) }
        let(:venue_1) { FactoryGirl.create(:venue) }
        let(:venue_1_staff_member) { FactoryGirl.create(:staff_member, master_venue: master_venue) }
        let(:venue_2) { FactoryGirl.create(:venue) }
        let(:venue_2_staff_member) { FactoryGirl.create(:staff_member, master_venue: master_venue) }

        before do
          venue_1_staff_member.work_venues << venue_1
          venue_2_staff_member.work_venues << venue_2
        end

        it 'returns staff members assigned to the venue' do
          expect(StaffMember.for_venue(venue_1)).to eq([venue_1_staff_member])
          expect(StaffMember.for_venue(venue_2)).to eq([venue_2_staff_member])
        end
      end
    end
  end

  describe 'age' do
    let(:staff_member) do
      FactoryGirl.build(:staff_member, date_of_birth: date_of_birth)
    end
    # Example date derived from production bug. This was being returned as 25
    let(:date_of_birth) { (now - (expected_age + 1).years + 5.days).to_date }
    let(:expected_age) { 24 }

    specify 'should calculate dob correctly' do
      expect(staff_member.age).to eq(expected_age)
    end
  end
end
