require 'rails_helper'

describe StaffMemberProfileAccessoryRequestQuery do
  let(:now) { Time.current }
  let(:today) { RotaShiftDate.to_rota_date(now) }
  let(:query) do
    StaffMemberProfileAccessoryRequestQuery.new(
      staff_member: staff_member,
      filter_params: filter_params
    )
  end
  let(:accessory) { FactoryGirl.create(:accessory) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:user) { FactoryGirl.create(:user) }


  context 'request exists' do
    let!(:existing_request) do
      AccessoryRequest.create!(
        staff_member: existing_request_staff_member,
        price_cents: accessory.price_cents,
        accessory: accessory,
        accessory_type: accessory.accessory_type
      ).tap do |accessory_request|
        accessory_request.transition_to!(:accepted, requster_user_id: user.id)
        accessory_request.transition_to!(:completed, requster_user_id: user.id)
        accessory_request.update_attributes!(payslip_date: existing_request_payslip_date)
      end
    end

    context 'staff member matches but not payslip date' do
      let(:existing_request_staff_member) { staff_member }
      let(:existing_request_payslip_date) { today }
      let(:filter_params) do
        {
          payslip_start_date: today - 1.week,
          payslip_end_date: today - 1.week
        }
      end


      it 'should not match' do
        expect(query.all.count).to eq(0)
      end
    end

    context 'payslip date matches but not staff member' do
      let(:other_staff_member) { FactoryGirl.create(:staff_member) }
      let(:existing_request_staff_member) { other_staff_member }
      let(:existing_request_payslip_date) { today }
      let(:filter_params) do
        {
          payslip_start_date: today - 1.day,
          payslip_end_date: today + 1.day
        }
      end

      it 'should not match' do
        expect(query.all.count).to eq(0)
      end
    end

    context 'request matches' do
      let(:existing_request_staff_member) { staff_member }
      let(:existing_request_payslip_date) { today }
      let(:filter_params) do
        {
          payslip_start_date: today - 1.day,
          payslip_end_date: today + 1.day
        }
      end

      it 'should not match' do
        expect(query.all.count).to eq(1)
      end
    end
  end
end
