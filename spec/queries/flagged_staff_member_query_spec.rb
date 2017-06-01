require 'rails_helper'

describe FlaggedStaffMemberQuery do
  let(:now) { Date.current }
  let(:query) do
    FlaggedStaffMemberQuery.new(
      first_name: first_name,
      surname: surname,
      date_of_birth: date_of_birth,
      email_address: email_address,
      national_insurance_number: national_insurance_number
    )
  end
  let(:staff_member_name) do
    Name.create!(
      first_name: 'Johnny',
      surname: 'Joneser'
    )
  end
  let(:staff_member_email_address) do
    EmailAddress.create!(
      email: 'st_test_email@fake.com'
    )
  end
  let(:staff_member_date_of_birth) do
    date_of_birth
  end
  let(:flagged_member) do
    FactoryGirl.create(
      :staff_member,
      :flagged,
      name: staff_member_name,
      email_address: staff_member_email_address,
      date_of_birth: staff_member_date_of_birth
    )
  end
  let(:first_name) { staff_member_name.first_name }
  let(:surname) { staff_member_name.surname }
  let(:date_of_birth) { now - 30.years }
  let(:email_address) { staff_member_email_address.email }
  let(:national_insurance_number) { flagged_member.national_insurance_number }

  before do
    flagged_member
  end

  it "should return the matching staff member" do
    expect(query.all.count).to eq(1)
    expect(query.all.first.id).to eq(flagged_member.id)
  end

  context "no details match" do
    let(:first_name) { 'wrong' }
    let(:surname) { 'name' }
    let(:staff_member_date_of_birth) { date_of_birth - 2.years }
    let(:email_address) { 'different.email@fake.com' }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    it "should not return the staff member" do
      expect(query.all.count).to eq(0)
    end
  end

  context "only first name matches" do
    let(:surname) { 'name' }
    let(:staff_member_date_of_birth) { date_of_birth - 2.years }
    let(:email_address) { 'different.email@fake.com' }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    context 'exactly' do
      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end

    context 'with different case' do
      let(:first_name) { staff_member_name.first_name.upcase }

      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end

    context 'partial match' do
      let(:first_name) { staff_member_name.first_name[2, 4] }

      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end
  end

  context "only surname matches" do
    let(:first_name) { 'wrong' }
    let(:staff_member_date_of_birth) { date_of_birth - 2.years }
    let(:email_address) { 'different.email@fake.com' }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    context 'exactly' do
      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end

    context 'with different case' do
      let(:surname) { staff_member_name.surname.upcase }

      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end

    context 'partial match' do
      let(:surname) { staff_member_name.surname[2, 4] }

      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end
  end

  context "first name and surname matches" do
    let(:staff_member_date_of_birth) { date_of_birth - 10.years }
    let(:email_address) { 'different.email@fake.com' }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    context 'exactly' do
      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end

    context 'first name with different case' do
      let(:first_name) { staff_member_name.first_name.upcase }

      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end

    context 'surname with different case' do
      let(:surname) { staff_member_name.surname.upcase }

      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end

    context 'first_name partial match' do
      let(:first_name) { staff_member_name.first_name[2, 4] }

      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end

    context 'surname partial match' do
      let(:surname) { staff_member_name.surname[2, 4] }

      it "should not return the staff member" do
        expect(query.all.count).to eq(0)
      end
    end
  end

  context "only date_of_birth matches" do
    let(:first_name) { 'wrong' }
    let(:surname) {'wrong too' }
    let(:email_address) { 'different.email@fake.com' }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    context 'exactly' do
      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end
  end

  context "only email_address matches" do
    let(:first_name) { 'wrong' }
    let(:surname) {'wrong too' }
    let(:staff_member_date_of_birth) { date_of_birth - 2.years }
    let(:national_insurance_number) { 'AD1fferentNumb3R' }

    context 'exactly' do
      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end
  end

  context "only national_insurance_number matches" do
    let(:first_name) { 'wrong' }
    let(:surname) {'wrong too' }
    let(:staff_member_date_of_birth) { date_of_birth - 2.years }
    let(:email_address) { 'different.email@fake.com' }

    context 'exactly' do
      it "should return the staff member" do
        expect(query.all.count).to eq(1)
        expect(query.all.first.id).to eq(flagged_member.id)
      end
    end
  end
end
