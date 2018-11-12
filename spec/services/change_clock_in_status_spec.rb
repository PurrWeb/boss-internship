require "rails_helper"

describe ChangeClockInStatus, :clocking do
  include ActiveSupport::Testing::TimeHelpers
  let(:day_start) { RotaShiftDate.new(Time.current).start_time }
  let(:date) { RotaShiftDate.to_rota_date(now) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: venue) }
  let(:requester) { FactoryGirl.create(:user) }
  let(:venue) { FactoryGirl.create(:venue) }
  let(:now) { day_start + 2.hours }

  describe "Clocking in" do
    let(:state) { :clocked_in }
    let(:service) do
      ChangeClockInStatus.new(
        date: date,
        venue: venue,
        requester: requester,
        staff_member: staff_member,
        state: state,
        at: now,
      )
    end
    let(:result) { service.call }

    around(:each) do |example|
      travel_to now do
        example.run
      end
    end

    before do
      staff_member
    end

    it "should succeed" do
      expect(result.success?).to eq(true)
    end

    context "staff member is already clocked in at other venue" do
      let(:other_venue) { FactoryGirl.create(:venue) }

      before do
        travel_to day_start do
          previous_transition = ChangeClockInStatus.new(
            date: date,
            venue: other_venue,
            requester: requester,
            staff_member: staff_member,
            state: :clocked_in,
            at: Time.current,
          )

          expect(previous_transition.call.success).to eq(true)
        end
      end

      it "should fail" do
        expect(result.success?).to eq(false)
      end
    end
  end

  describe "HoursAcceptancePeriod creation on clock out" do
    context "before call" do
      it "no clock in periods should exist" do
        expect(ClockInPeriod.count).to eq(0)
      end
      it "no clock in breaks should exist" do
        expect(ClockInBreak.count).to eq(0)
      end
      it "no hours acceptance periods should exist" do
        expect(HoursAcceptancePeriod.count).to eq(0)
      end
      it "no hours acceptance breaks should exist" do
        expect(HoursAcceptanceBreak.count).to eq(0)
      end
    end

    context "when start break and clock out on the same minute" do
      let(:nearest_minute) { 10 }
      let(:now) { (day_start + 2.hours).change(min: nearest_minute) }
      let(:end_seconds) { 40.seconds }

      before do
        clock_in(call_time: day_start)
        start_break(call_time: now)
        clock_out(call_time: now + end_seconds)
      end

      it "one clock in period should exist" do
        expect(ClockInPeriod.count).to eq(1)
      end
      it "one clock in break should exist" do
        expect(ClockInBreak.count).to eq(1)
      end
      it "one hours acceptance period should exist" do
        expect(HoursAcceptancePeriod.count).to eq(1)
      end
      it "one hours acceptance break should exist" do
        expect(HoursAcceptanceBreak.count).to eq(1)
      end
      it "hours acceptance period `ends_at` and hours acceptance break `ends_at` should be rounded to nearest minute" do
        hours_acceptance_period = HoursAcceptancePeriod.last
        hours_acceptance_break = HoursAcceptanceBreak.last
        period_ends_at = hours_acceptance_period.ends_at
        break_ends_at = hours_acceptance_break.ends_at

        expect(period_ends_at.sec).to eq(0)
        expect(break_ends_at.sec).to eq(0)
        expect(period_ends_at.min).to eq(nearest_minute)
        expect(break_ends_at.min).to eq(nearest_minute)
      end
      it "hours acceptance period `ends_at` should not be equal clock in period `ends_at`" do
        hours_acceptance_period = HoursAcceptancePeriod.last
        clock_in_period = ClockInPeriod.last
        expect(hours_acceptance_period.ends_at).to_not eq(clock_in_period.ends_at)
      end
      it "hours acceptance period `ends_at` minute should be equal clock in period `ends_at` minute" do
        hours_acceptance_period = HoursAcceptancePeriod.last
        clock_in_period = ClockInPeriod.last
        hours_acceptance_period_ends_at = hours_acceptance_period.ends_at
        clock_in_period_ends_at = clock_in_period.ends_at

        expect(hours_acceptance_period_ends_at.min).to eq(clock_in_period_ends_at.min)
      end
      it "hours acceptance break `ends_at` should not be equal clock in break `ends_at`" do
        clock_in_break = ClockInBreak.last
        hours_acceptance_break = HoursAcceptanceBreak.last
        expect(hours_acceptance_break.ends_at).to_not eq(clock_in_break.ends_at)
      end
      it "hours acceptance break `ends_at` minute should be equal clock in break `ends_at` minute" do
        hours_acceptance_break = HoursAcceptanceBreak.last
        clock_in_break = ClockInBreak.last
        hours_acceptance_break_ends_at = hours_acceptance_break.ends_at
        clock_in_break_ends_at = clock_in_break.ends_at

        expect(hours_acceptance_break_ends_at.min).to eq(clock_in_break_ends_at.min)
      end
      it "hours acceptance period `ends_at` should should have diffrence with clock in period `ends_at`" do
        hours_acceptance_period = HoursAcceptancePeriod.last
        clock_in_period = ClockInPeriod.last
        expect(hours_acceptance_period.ends_at).to eq(clock_in_period.ends_at - end_seconds)
      end
      it "hours acceptance break `ends_at` should should have diffrence with clock in break `ends_at`" do
        clock_in_break = ClockInBreak.last
        hours_acceptance_break = HoursAcceptanceBreak.last
        expect(hours_acceptance_break.ends_at).to eq(clock_in_break.ends_at - end_seconds)
      end
    end

    def clock_in(call_time:)
      travel_to call_time do
        ChangeClockInStatus.new(
          date: date,
          venue: venue,
          requester: requester,
          staff_member: staff_member,
          state: :clocked_in,
          at: Time.current,
        ).call
      end
    end

    def clock_out(call_time:)
      travel_to call_time do
        ChangeClockInStatus.new(
          date: date,
          venue: venue,
          requester: requester,
          staff_member: staff_member,
          state: :clocked_out,
          at: Time.current,
        ).call
      end
    end

    def start_break(call_time:)
      travel_to call_time do
        ChangeClockInStatus.new(
          date: date,
          venue: venue,
          requester: requester,
          staff_member: staff_member,
          state: :on_break,
          at: Time.current,
        ).call
      end
    end

    def end_break(call_time:)
      travel_to call_time do
        ChangeClockInStatus.new(
          date: date,
          venue: venue,
          requester: requester,
          staff_member: staff_member,
          state: :clocked_in,
          at: Time.current,
        ).call
      end
    end
  end
end
