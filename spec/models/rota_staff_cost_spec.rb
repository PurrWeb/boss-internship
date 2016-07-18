require 'rails_helper'

RSpec.describe RotaStaffCost do
  describe '#total' do
    let(:pay_rate) { FactoryGirl.create(:pay_rate, cents: 1500) }
    let!(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        pay_rate: pay_rate
      )
    end
    let(:venue) { staff_member.master_venue }
    let(:week) { RotaWeek.new(RotaShiftDate.to_rota_date(Time.current) + 1.week) }
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
        expect(RotaStaffCost.new(
          staff_members: staff_members,
          rota: rota
        ).total).to eq(Money.new(0))
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
          RotaStaffCost.new(
            staff_members: staff_members,
            rota: rota
          ).total
        ).to eq(
          Money.from_amount(staff_member.pay_rate.rate_in_pounds * 1.5)
        )
      end

      context 'when staff member has weekly salary' do
        let(:pay_rate) { FactoryGirl.create(:pay_rate, :weekly, cents: 20000) }

        context 'all staff members hours for the week are part of rota' do
          it 'should pay the full weekly rate' do
            expect(
              RotaStaffCost.new(
                staff_members: staff_members,
                rota: rota
              ).total
            ).to eq(
              Money.from_amount(staff_member.pay_rate.rate_in_pounds)
            )
          end
        end

        context 'staff members has hours for the week in a different rota' do
          before do
            other_date = week.start_date + 1.day
            other_start_time = RotaShiftDate.new(other_date).start_time
            other_rota = FactoryGirl.create(
              :rota,
              date: other_date,
              venue: venue
            )
            FactoryGirl.create(
              :rota_shift,
              rota: other_rota,
              staff_member: staff_member,
              starts_at: other_start_time + 4.hour,
              ends_at: other_start_time + 5.hour
            )
            FactoryGirl.create(
              :rota_shift,
              rota: other_rota,
              staff_member: staff_member,
              starts_at: other_start_time + 7.hour,
              ends_at: other_start_time + 7.hour + 30.minutes
            )
          end

          it 'should pay the full weekly rate' do
            expect(
              RotaStaffCost.new(
                staff_members: staff_members,
                rota: rota
              ).total
            ).to eq(
              Money.from_amount(staff_member.pay_rate.rate_in_pounds * 0.5)
            )
          end
        end
      end
    end
  end
end
