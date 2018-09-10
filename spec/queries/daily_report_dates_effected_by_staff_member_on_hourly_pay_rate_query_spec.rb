require 'rails_helper'

describe DailyReportDatesEffectedByStaffMemberOnHourlyPayRateQuery do
  let(:now) { Time.current }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  subject do
    DailyReportDatesEffectedByStaffMemberOnHourlyPayRateQuery.new(
      staff_member: staff_member
    )
  end
  let(:user) { FactoryGirl.create(:user) }

  context 'when staff member has shift' do
    context 'shift is in future week' do
      let(:next_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) + 1.week) }
      let(:rota_date) { next_week.start_date }
      let(:rota_venue) { staff_member.master_venue }
      let(:rota) { FactoryGirl.create(:rota, date: rota_date, venue: rota_venue)}
      let(:shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          date: rota_date
        )
      end

      before do
        shift
      end

      it 'should give date and venue for shift' do
        expect(
          subject.to_a
        ).to include([rota_date, rota_venue])
      end
    end

    context 'shift is in current week' do
      let(:current_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
      let(:rota_date) { current_week.start_date }
      let(:rota_venue) { staff_member.master_venue }
      let(:rota) { FactoryGirl.create(:rota, date: rota_date, venue: rota_venue)}
      let(:shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          date: rota_date
        )
      end

      before do
        shift
      end

      it 'should give date and venue for shift' do
        expect(
          subject.to_a
        ).to include([rota_date, rota_venue])
      end
    end

    context 'shift is in past week' do
      let(:past_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) - 1.week) }
      let(:rota_date) { past_week.end_date }
      let(:rota_venue) { staff_member.master_venue }
      let(:rota) { FactoryGirl.create(:rota, date: rota_date, venue: rota_venue)}
      let(:shift) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member,
          rota: rota,
          date: rota_date
        )
      end

      before do
        shift
      end

      it 'should not give date and venue for shift' do
        expect(
          subject.to_a
        ).to eq([])
      end
    end
  end

  context 'when staff member has hours acceptance' do
    context 'hours acceptance is accepted' do
      let(:acceptance_period_status) { HoursAcceptancePeriod::ACCEPTED_STATE }

      context 'hours acceptance is in future week' do
        let(:next_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) + 1.week) }
        let(:date) { next_week.start_date }
        let(:venue) { staff_member.master_venue }
        let(:clock_in_day) do
          ClockInDay.create!(
            staff_member: staff_member,
            venue: venue,
            date: date,
            creator: user
          )
        end
        let(:hours_acceptance_period_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: staff_member.master_venue,
            week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
          )
        end
        let(:hours_acceptance) do
          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            creator: user,
            starts_at: RotaShiftDate.new(date).start_time,
            ends_at: RotaShiftDate.new(date).start_time + 3.hours,
            accepted_by: user,
            accepted_at: Time.now.utc,
            status: acceptance_period_status,
            finance_report: hours_acceptance_period_finance_report
          )
        end

        before do
          hours_acceptance
        end

        it 'should give date and venue for shift' do
          expect(
            subject.to_a
          ).to include([date, venue])
        end
      end

      context 'hours acceptance is in current week' do
        let(:current_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
        let(:date) { current_week.start_date }
        let(:venue) { staff_member.master_venue }
        let(:clock_in_day) do
          ClockInDay.create!(
            staff_member: staff_member,
            venue: venue,
            date: date,
            creator: user
          )
        end
        let(:hours_acceptance_period_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: staff_member.master_venue,
            week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
          )
        end
        let(:hours_acceptance) do
          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            creator: user,
            starts_at: RotaShiftDate.new(date).start_time,
            ends_at: RotaShiftDate.new(date).start_time + 3.hours,
            accepted_by: user,
            accepted_at: Time.now.utc,
            status: acceptance_period_status,
            finance_report: hours_acceptance_period_finance_report
          )
        end

        before do
          hours_acceptance
        end

        it 'should give date and venue for shift' do
          expect(
            subject.to_a
          ).to include([date, venue])
        end
      end

      context 'hours acceptance is in past week' do
        let(:past_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) - 1.week) }
        let(:date) { past_week.start_date }
        let(:venue) { staff_member.master_venue }
        let(:clock_in_day) do
          ClockInDay.create!(
            staff_member: staff_member,
            venue: venue,
            date: date,
            creator: user
          )
        end
        let(:hours_acceptance_period_finance_report) do
          FactoryGirl.create(
            :finance_report,
            staff_member: staff_member,
            venue: staff_member.master_venue,
            week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
          )
        end
        let(:hours_acceptance) do
          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            creator: user,
            starts_at: RotaShiftDate.new(date).start_time,
            ends_at: RotaShiftDate.new(date).start_time + 3.hours,
            accepted_by: user,
            accepted_at: Time.now.utc,
            status: acceptance_period_status,
            finance_report: hours_acceptance_period_finance_report
          )
        end

        before do
          hours_acceptance
        end

        it 'should not give date and venue for shift' do
          expect(
            subject.to_a
          ).to eq([])
        end
      end
    end

    context 'acceptance period is not accepted' do
      let(:acceptance_period_status) { 'pending' }

      context 'hours acceptance is in future week' do
        let(:next_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) + 1.week) }
        let(:date) { next_week.start_date }
        let(:venue) { staff_member.master_venue }
        let(:clock_in_day) do
          ClockInDay.create!(
            staff_member: staff_member,
            venue: venue,
            date: date,
            creator: user
          )
        end
        let(:hours_acceptance) do
          HoursAcceptancePeriod.create!(
            clock_in_day: clock_in_day,
            creator: user,
            starts_at: RotaShiftDate.new(date).start_time,
            ends_at: RotaShiftDate.new(date).start_time + 3.hours,
            status: acceptance_period_status
          )
        end

        before do
          hours_acceptance
        end

        it 'should should not give date and venue for shift' do
          expect(
            subject.to_a
          ).to eq([])
        end
      end
    end
  end
end
