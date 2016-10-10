require 'rails_helper'

describe StaffMemberWronglyOn25PlusPayrateQuery do
  let(:now) { Time.current }

  let(:subject) do
    StaffMemberWronglyOn25PlusPayrateQuery.new(now: now)
  end

  let(:pay_rate) do
    FactoryGirl.create(:pay_rate, name: 'Age 25+')
  end

  let(:staff_member) do
    FactoryGirl.create(
      :staff_member,
      date_of_birth: date_of_birth,
      pay_rate: pay_rate
    )
  end

  before do
    staff_member
  end

  context 'staff member is 24' do
    let(:date_of_birth) { ((now - 25.years) + 1.day).to_date }

    it 'should return staff_member' do
      expect(subject.all).to include(staff_member)
    end
  end

  context 'staff member is 25' do
    let(:date_of_birth) { (now - 25.years).to_date }

    it 'should return staff_member' do
      expect(subject.all).to_not include(staff_member)
    end
  end

  context 'staff member is over 26' do
    let(:date_of_birth) { (now - 26.years).to_date }

    it 'should return staff_member' do
      expect(subject.all).to_not include(staff_member)
    end
  end
end
