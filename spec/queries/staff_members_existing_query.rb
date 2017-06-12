require 'rails_helper'

describe StaffMembersExistingQuery do
  let(:query) { StaffMembersExistingQuery.new(email, nin) }

  let(:flagged_staff_member) do
    FactoryGirl.create(
      :staff_member,
      :flagged
    )
  end

  let(:staff_members) do
    FactoryGirl.create_list(
      :staff_member,
      2
    )
  end

  let(:staff_member_profile1) do
    {
      profile_url: url_helpers.staff_member_path(staff_members[0]),
      full_name: staff_members[0].full_name,
      field: field1
    }
  end

  let(:staff_member_profile2) do
    {
      profile_url: url_helpers.staff_member_path(staff_members[1]),
      full_name: staff_members[1].full_name,
      field: field2
    }
  end

  before do
    flagged_staff_member
    staff_members
  end

  context 'Flagged member match' do
    let(:email) {flagged_staff_member.email_address.email}
    let(:nin) {flagged_staff_member.national_insurance_number}

    it "should return empty profile data" do
      expect(query.profiles).to eq([])
    end
  end

  context 'Staff member match' do
    context 'when `Email` and `Nin` present, and belongs to one' do
      let(:email) {staff_members[0].email_address.email}
      let(:nin) {staff_members[0].national_insurance_number}
      let(:field1) { "email and national insurance number" }

      it "should return one staff member profile data" do
        expect(query.profiles).to eq([staff_member_profile1])
      end
    end
    context 'when `Email` and `Nin` present, and belongs to different' do
      let(:email) {staff_members[0].email_address.email}
      let(:nin) {staff_members[1].national_insurance_number}
      let(:field1) { "email" }
      let(:field2) { "national insurance number" }

      it "should return two staff members profile data" do
        expect(query.profiles).to eq([staff_member_profile1, staff_member_profile2])
      end
    end
    context 'when only `Email` present' do
      let(:email) {staff_members[0].email_address.email}
      let(:nin) {nil}
      let(:field1) { "email" }

      it "should return one staff members profile data" do
        expect(query.profiles).to eq([staff_member_profile1])
      end
    end

    context 'when only `NIN` present' do
      let(:email) {nil}
      let(:nin) {staff_members[0].national_insurance_number}
      let(:field1) { "national insurance number" }

      it "should return one staff members profile data" do
        expect(query.profiles).to eq([staff_member_profile1])
      end
    end
  end
  context 'Staff member don\'t match' do
    context 'when `Email` and `Nin` present' do
      let(:email) { 'test@fake.com' }
      let(:nin) { 'QQ123456C' }

      it "should return empty profile data" do
        expect(query.profiles).to eq([])
      end
    end
    context 'when only `Email` present' do
      let(:email) { 'test@fake.com' }
      let(:nin) { nil }

      it "should return empty profile data" do
        expect(query.profiles).to eq([])
      end
    end
    context 'when only `NIN` present' do
      let(:email) { nil }
      let(:nin) { 'QQ123456C' }

      it "should return empty profile data" do
        expect(query.profiles).to eq([])
      end
    end
  end

  def url_helpers
    Rails.application.routes.url_helpers
  end

end
