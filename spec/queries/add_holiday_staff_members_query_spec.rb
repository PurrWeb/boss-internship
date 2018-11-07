require "rails_helper"

describe AddHolidayStaffMembersQuery, :holiday do
  let!(:venue1) { FactoryGirl.create(:venue) }
  let!(:venue2) { FactoryGirl.create(:venue) }
  let!(:venue3) { FactoryGirl.create(:venue) }
  let!(:requester) { FactoryGirl.create(:user, :manager, venues: [venue1, venue2]) }
  let!(:hourly_pay_rate) { FactoryGirl.create(:pay_rate, :hourly) }
  let!(:weekly_pay_rate) { FactoryGirl.create(:pay_rate, :weekly) }
  let(:query) do
    AddHolidayStaffMembersQuery.new(
      requester: requester,
    )
  end
  let(:staff_member_name) do
    Name.create!(
      first_name: "Johnny",
      surname: "Joneser",
    )
  end
  let!(:staff_member_1) do
    FactoryGirl.create(
      :staff_member,
      pay_rate: hourly_pay_rate,
      name: staff_member_name,
      master_venue: venue1,
    )
  end
  let!(:staff_member_2) do
    FactoryGirl.create(
      :staff_member,
      pay_rate: hourly_pay_rate,
      name: staff_member_name,
      master_venue: venue2,
    )
  end
  let!(:not_in_result_staff_member) do
    FactoryGirl.create(
      :staff_member,
      pay_rate: weekly_pay_rate,
      name: staff_member_name,
      master_venue: venue1,
    )
  end

  context "before call" do
    specify "staff members should exist" do
      expect(StaffMember.count).to eq(3)
    end
  end

  context "when result should exist" do
    context "when venue doesn't applied to query" do
      it "should return the matching staff member" do
        result = query.all(query: "joh")
        expect(result.count).to eq(2)
        expect(result[0].id).to eq(staff_member_1.id)
        expect(result[1].id).to eq(staff_member_2.id)
      end
    end
    context "when venue applied to query" do
      it "should return the matching staff member" do
        result = query.all(query: "joh", venue: venue1)
        expect(result.count).to eq(1)
        expect(result[0].id).to eq(staff_member_1.id)
      end
    end
  end
  context "when result shouldn't exist" do
    context "when requester doesn't have access to staff members venues" do
      let(:requester) { FactoryGirl.create(:user, :manager, venues: [venue3]) }
      it "shouldn't return staff members" do
        result = query.all(query: "joh")
        expect(result.count).to eq(0)
      end
    end
  end
end
