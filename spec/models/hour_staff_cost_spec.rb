require 'rails_helper'

RSpec.describe HourlyStaffCost do
  describe '#total' do
    let(:pay_rate) { FactoryGirl.create(:pay_rate, cents: 1500) }
    let!(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        pay_rate: pay_rate
      )
    end
    let(:venue) { staff_member.master_venue }
    let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.zone.now) + 1.week) }
    let(:rota) do
      FactoryGirl.create(
        :rota,
        date: week.start_date,
        venue: venue
      )
    end
    let(:staff_members) { StaffMember.all }


    context 'when staff member has no shifts' do
      it 'should return 0' do
        expect(
          HourlyStaffCost.new(
            staff_members: staff_members,
            rota: rota
          ).total_cents
        ).to eq(0)
      end
    end

    context 'when staff member has shifts' do
      let(:start_time) { RotaShiftDate.new(week.start_date).start_time }
      let!(:rota_shift_1) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member,
          starts_at: start_time + 1.hour,
          ends_at: start_time + 2.hour
        )
      end
      let!(:rota_shift_2) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member,
          starts_at: start_time + 3.hour,
          ends_at: start_time + 3.hour + 30.minutes
        )
      end

      it 'should calcualte the total cost' do
        expect(
          HourlyStaffCost.new(
            staff_members: staff_members,
            rota: rota
          ).total_cents
        ).to eq(
          staff_member.pay_rate.cents * 1.5
        )
      end

      context 'when staff member has weekly salary' do
        let(:pay_rate) { FactoryGirl.create(:pay_rate, :weekly, cents: 20000) }

        context 'all staff members hours for the week are part of rota' do
          it 'should show up as 0' do
            expect(
              HourlyStaffCost.new(
                staff_members: staff_members,
                rota: rota
              ).total_cents
            ).to eq(
              0
            )
          end
        end
      end
    end

    context 'mutliple staff members exist' do
      let(:staff_member_2_pay_rate) { FactoryGirl.create(:pay_rate, cents: 20500) }
      let(:staff_member_1_rate) { FactoryGirl.create(:pay_rate, cents: 1500) }
      let!(:staff_member_1) do
        FactoryGirl.create(
          :staff_member,
          pay_rate: staff_member_1_rate,
          master_venue: venue
        )
      end
      let(:staff_member_2) do
        FactoryGirl.create(
          :staff_member,
          pay_rate: staff_member_2_pay_rate,
          master_venue: venue
        )
      end
      let(:venue) { FactoryGirl.create(:venue) }
      let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.zone.now) + 1.week) }
      let(:rota) do
        FactoryGirl.create(
          :rota,
          date: week.start_date,
          venue: venue
        )
      end
      let(:start_time) { RotaShiftDate.new(rota.date).start_time }
      let(:staff_members) { StaffMember.all }
      let(:staff_member_2_shifts) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member_2,
          starts_at: start_time + 4.hour,
          ends_at: start_time + 5.hour + 30.minutes
        )
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member_2,
          starts_at: start_time + 6.hours,
          ends_at: start_time + 6.hours + 30.minutes
        )
      end
      let(:staff_member_1_shifts) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member_1,
          starts_at: start_time + 4.hour,
          ends_at: start_time + 5.hour
        )
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member_1,
          starts_at: start_time + 7.hour,
          ends_at: start_time + 7.hour + 30.minutes
        )
      end

      before do
        staff_member_1
        staff_member_1_shifts
        staff_member_2
        staff_member_2_shifts
      end

      specify do
        staff_member_1_hours = 1.5
        staff_member_2_hours = 2

        expect(
          HourlyStaffCost.new(
            staff_members: staff_members,
            rota: rota
          ).total_cents
        ).to eq(
          (staff_member_1.pay_rate.cents * staff_member_1_hours) +
          (staff_member_2.pay_rate.cents * staff_member_2_hours)
        )
      end
    end
  end
end
