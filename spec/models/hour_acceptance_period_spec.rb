require 'rails_helper'

describe HoursAcceptancePeriod do
  describe 'validations' do
    let(:now) { Time.current }
    let(:date) { RotaShiftDate.to_rota_date(now) }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:finance_report) do
      FactoryGirl.create(
        :finance_report,
        staff_member: staff_member,
        venue: staff_member.master_venue,
        week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
      )
    end
    let(:period) do
      HoursAcceptancePeriod.new(
        clock_in_day: clock_in_day,
        starts_at: starts_at,
        ends_at: ends_at,
        creator: user,
        accepted_by: user,
        accepted_at: Time.now.utc,
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        finance_report: finance_report
      )
    end
    let(:period_without_acceptor) do
      HoursAcceptancePeriod.new(
        clock_in_day: clock_in_day,
        starts_at: starts_at,
        ends_at: ends_at,
        creator: user,
        status: HoursAcceptancePeriod::ACCEPTED_STATE,
        finance_report: finance_report
      )
    end
    let(:starts_at) { start_of_day + 1.hour }
    let(:ends_at) { start_of_day + 2.hours }
    let(:user) { FactoryGirl.create(:user) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:clock_in_day) do
      ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        venue: venue,
        date: date
      )
    end

    specify do
      period.validate
      expect(period.errors.to_a).to eq([])
    end

    specify do
      period_without_acceptor.validate
      expect(period_without_acceptor.errors.to_a).to eq(["Accepted at can't be blank", "Accepted by can't be blank"])
    end

    context 'times are in wrong order' do
      let(:starts_at) { start_of_day + 2.hours }
      let(:ends_at) { start_of_day + 1.hour }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:starts_at]).to include(" must be before end time")
      end
    end

    context 'starts_at on wrong rota date' do
      let(:starts_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:starts_at]).to eq([
          starts_at_early_error_message_for(
            time: period.starts_at,
            date: period.date
          )
        ])
      end
    end

    context 'ends_at on wrong rota date' do
      let(:ends_at) { start_of_day - 2.hours }

      specify 'should raise error' do
        period.validate
        expect(period.errors[:ends_at]).to eq([
          " must be after start time",
          ends_at_early_error_message_for(
            time: period.ends_at,
            date: period.date
          )
        ])
      end
    end

    context 'period overlaps existing period' do
      let(:existing_period_clock_in_day) { clock_in_day }
      let(:existing_period_starts_at) { starts_at }
      let(:existing_period_ends_at) { ends_at }
      let(:existing_period_finance_report) do
        FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: staff_member.master_venue,
          week_start: RotaWeek.new(RotaShiftDate.to_rota_date(now)).start_date
        )
      end
      let(:existing_period) do
        HoursAcceptancePeriod.create!(
          clock_in_day: existing_period_clock_in_day,
          starts_at: existing_period_starts_at,
          ends_at: existing_period_ends_at,
          creator: user,
          accepted_by: user,
          accepted_at: Time.now.utc,
          status: HoursAcceptancePeriod::ACCEPTED_STATE,
          finance_report: existing_period_finance_report
        )
      end

      before do
        existing_period
      end


      specify do
        expect(existing_period.accepted?).to eq(true)
      end

      specify 'should raise overlap error' do
        period.validate
        expect(period.errors[:base]).to include("period overlaps existing period")
      end

      context 'existing period is for different venue' do
        let(:new_venue) { FactoryGirl.create(:venue) }
        let(:existing_period_clock_in_day) do
          ClockInDay.create!(
            venue: new_venue,
            staff_member: staff_member,
            date: date,
            creator: user
          )
        end

        specify 'should raise overlap error' do
          period.validate
          expect(period.errors[:base]).to include("period overlaps existing period")
        end
      end

      context 'existing period unaccepted' do
        let(:existing_period) do
          HoursAcceptancePeriod.create!(
            clock_in_day: existing_period_clock_in_day,
            starts_at: existing_period_starts_at,
            ends_at: existing_period_ends_at,
            creator: user,
            accepted_by: user,
            accepted_at: Time.now.utc,
          )
        end

        before do
          existing_period
        end

        specify do
          expect(existing_period.accepted?).to eq(false)
        end

        specify 'should not raise overlap error' do
          period.validate
          expect(period.errors[:base]).to_not include("period overlaps existing period")
        end
      end

      context 'existing period is for different staff_member' do
        let(:new_staff_member) { FactoryGirl.create(:staff_member) }
        let(:existing_period_clock_in_day) do
          ClockInDay.create!(
            venue: venue,
            staff_member: new_staff_member,
            date: date,
            creator: user
          )
        end
        specify 'should not raise overlap error' do
          period.validate
          expect(period.errors[:base]).to eq([])
        end
      end
    end

    context 'period overlaps itself' do
      before do
        period.save!
      end

      specify 'should not raise overlap error' do
        period.starts_at = period.starts_at - 10.minutes

        period.validate
        expect(period.errors[:base]).to eq([])
      end
    end

    context 'period overlaps existing owed hour' do
      before do
        minutes = (ends_at - starts_at) / 60

        finance_report = FactoryGirl.create(
          :finance_report,
          staff_member: staff_member,
          venue: staff_member.master_venue,
          week_start: RotaWeek.new(date).start_date
        )
        OwedHour.create!(
          date: date,
          staff_member: staff_member,
          starts_at: starts_at,
          ends_at: ends_at,
          payslip_date: date,
          minutes: minutes,
          creator: user,
          note: 'test note',
          finance_report: finance_report
        )
      end

      specify 'should raise overlap error' do
        period.validate
        expect(period.errors[:base]).to eq(["conflicting owed hour exists"])
      end
    end

    def starts_at_early_error_message_for(time:,  date:)
      "time #{time} suppiled too early for #{date}"
    end

    def ends_at_early_error_message_for(time:,  date:)
      "time #{time} suppiled too early for #{date}"
    end
  end

  describe 'payable hours' do
    let(:now) { Time.current }
    let(:date) { now.to_date }
    let(:start_of_day) { RotaShiftDate.new(date).start_time }
    let(:period) do
      HoursAcceptancePeriod.create!(
        clock_in_day: clock_in_day,
        starts_at: starts_at,
        ends_at: ends_at,
        creator: user
      )
    end
    let(:starts_at) { start_of_day }
    let(:ends_at) { start_of_day + 2.hours + 30.minutes }
    let(:user) { FactoryGirl.create(:user) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:clock_in_day) do
      ClockInDay.create!(
        creator: user,
        staff_member: staff_member,
        venue: venue,
        date: date
      )
    end

    it 'should report legnth correctly' do
      expect(period.payable_hours).to eq(2.5)
    end

    context 'when breaks exist' do
      let(:break1) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: period,
          starts_at: start_of_day + 2.hours,
          ends_at: start_of_day + 2.hours + 30.minutes
        )
      end
      let(:break2) do
        HoursAcceptanceBreak.create!(
          hours_acceptance_period: period,
          starts_at: start_of_day + 1.hours,
          ends_at: start_of_day + 2.hours
        )
      end

      before do
        break1
        break2
      end

      specify do
        expect(period.payable_hours).to eq(1)
      end
    end

    context '#.hours_acceptance_breaks_enabled' do
      let!(:break1) do
        period.save!

        period.hours_acceptance_breaks.create!(
          starts_at: start_of_day + 2.hours,
          ends_at: start_of_day + 2.hours + 30.minutes
        )
      end

      let!(:break2) do
        period.hours_acceptance_breaks.create!(
          starts_at: start_of_day + 1.hours,
          ends_at: start_of_day + 2.hours,
          disabled_by: user,
          disabled_at: start_of_day.end_of_day
        )
      end

      specify 'to be equal to #.hours_acceptance_breaks.enabled' do
        expect(
          period.hours_acceptance_breaks.enabled
        ).to eq(
          period.hours_acceptance_breaks_enabled
        )

        expect(period.hours_acceptance_breaks.enabled.count).to eq(1)
        expect(period.hours_acceptance_breaks_enabled.count).to eq(1)
        expect(period.hours_acceptance_breaks_enabled.first.id).to eq(break1.id)
        expect(period.hours_acceptance_breaks.enabled.first.id).to eq(break1.id)
      end
    end
  end
end
