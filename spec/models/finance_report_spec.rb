require 'rails_helper'

#Used to make it easier to test the boolean status methods
def status_methods_hash(finance_report)
  {
    requiring_update: finance_report.requiring_update?,
    incomplete: finance_report.incomplete?,
    ready: finance_report.ready?,
    done: finance_report.done?
  }
end

describe FinanceReport do
  let(:now) { Time.current }
  let(:rota_date) { RotaShiftDate.to_rota_date(now) }
  let(:week) { RotaWeek.new(rota_date) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:venue) { staff_member.master_venue }
  let(:week_start) { week.start_date }
  # used to create valid records which requre extra values
  let(:valid_extra_attributes) do
    {
      venue_name: 'foo',
      staff_member_name: 'foo',
      pay_rate_description: 'foo',
      accessories_cents: 'foo',
      contains_time_shifted_owed_hours: 'foo',
      contains_time_shifted_holidays: 'foo',
      monday_hours_count: 2.3,
      tuesday_hours_count: 23.34,
      wednesday_hours_count: 11.22,
      thursday_hours_count: 22.33,
      friday_hours_count: 33.44,
      saturday_hours_count: 44.55,
      sunday_hours_count: 55.66,
      total_hours_count: 122.3232,
      owed_hours_minute_count: 120,
      total_cents: 5000,
      holiday_days_count: 23
    }
  end
  let(:invalid_extra_attributes) do
    {
      venue_name: nil,
      staff_member_name: nil,
      pay_rate_description: nil,
      accessories_cents: nil,
      contains_time_shifted_owed_hours: nil,
      contains_time_shifted_holidays: nil,
      monday_hours_count: nil,
      tuesday_hours_count: nil,
      wednesday_hours_count: nil,
      thursday_hours_count: nil,
      friday_hours_count: nil,
      saturday_hours_count: nil,
      sunday_hours_count: nil,
      total_hours_count: nil,
      owed_hours_minute_count: nil,
      total_cents: nil,
      holiday_days_count: nil
    }
  end

  context 'supplying no params' do
    let(:finance_report) { FinanceReport.new }

    it 'it should not be valid' do
      expect(finance_report.valid?).to eq(false)
    end
  end

  context 'supplying key params only' do
    let(:finance_report) do
      FinanceReport.new(
        staff_member: staff_member,
        venue: venue,
        week_start: week_start,
        requiring_update: true
      )
    end

    it 'should be valid' do
      expect(finance_report.valid?).to eq(true)
    end

    it 'should report being in correct state' do
      expect(finance_report.current_state).to eq(FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s)
      expect(status_methods_hash(finance_report)).to eq({
        requiring_update: true,
        incomplete: false,
        ready: false,
        done: false
      })
    end

    context 'mark as incomplete' do
      let(:extra_attributes) { invalid_extra_attributes }
      before do
        finance_report.save!
        finance_report.assign_attributes(extra_attributes)
      end

      it 'should not be valid' do
        expect{ finance_report.mark_incomplete! }.to raise_error(Statesman::GuardFailedError)
      end

      it 'should not change state' do
        begin
          finance_report.mark_incomplete!
        rescue Statesman::GuardFailedError
          #swallow
        end
        expect(finance_report.valid?).to eq(true)
        expect(finance_report.current_state).to eq(FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s)
        expect(status_methods_hash(finance_report)).to eq({
          requiring_update: true,
          incomplete: false,
          ready: false,
          done: false
        })
      end

      context 'supplying valid attributes' do
        let(:extra_attributes) do
          valid_extra_attributes
        end
        it 'should be valid' do
          expect{ finance_report.mark_incomplete! }.to_not raise_error
          expect(finance_report.valid?).to eq(true)
        end

        it 'should report being in correct state' do
          finance_report.mark_incomplete!
          expect(finance_report.current_state).to eq(FinanceReportStateMachine::INCOMPLETE_STATE.to_s)
          expect(status_methods_hash(finance_report)).to eq({
            requiring_update: false,
            incomplete: true,
            ready: false,
            done: false
          })
        end
      end
    end

    context 'mark as ready' do
      let(:extra_attributes) { invalid_extra_attributes }
      before do
        finance_report.save!
        finance_report.assign_attributes(extra_attributes)
      end

      it 'should not be valid' do
        expect{ finance_report.mark_ready! }.to raise_error(Statesman::GuardFailedError)
      end

      it 'should not change state' do
        begin
          finance_report.mark_ready!
        rescue Statesman::GuardFailedError
          #swallow
        end
        expect(finance_report.valid?).to eq(true)
        expect(finance_report.current_state).to eq(FinanceReportStateMachine::REQUIRING_UPDATE_STATE.to_s)
        expect(status_methods_hash(finance_report)).to eq({
          requiring_update: true,
          incomplete: false,
          ready: false,
          done: false
        })
      end

      context 'supplying valid attributes' do
        let(:extra_attributes) { valid_extra_attributes }
        it 'should be valid' do
          expect{ finance_report.mark_ready! }.to_not raise_error
          expect(finance_report.valid?).to eq(true)
        end

        it 'should report being in correct state' do
          finance_report.mark_ready!
          expect(finance_report.current_state).to eq(FinanceReportStateMachine::READY_STATE.to_s)
          expect(status_methods_hash(finance_report)).to eq({
            requiring_update: false,
            incomplete: false,
            ready: true,
            done: false
          })
        end
      end
    end

    context 'mark as done' do
      before do
        finance_report.assign_attributes(valid_extra_attributes)
        finance_report.save!
        finance_report.mark_ready!
        finance_report.assign_attributes(extra_attributes)
      end

      context 'invalid attributes supplied' do
        let(:extra_attributes) { invalid_extra_attributes }

        it 'should not be valid' do
          expect{ finance_report.mark_completed! }.to raise_error(Statesman::GuardFailedError)
        end

        it 'should not change state' do
          begin
            finance_report.mark_completed!
          rescue Statesman::GuardFailedError
            #swallow
          end
          expect(finance_report.valid?).to eq(false)
          expect(finance_report.current_state).to eq(FinanceReportStateMachine::READY_STATE.to_s)
          expect(status_methods_hash(finance_report)).to eq({
            requiring_update: false,
            incomplete: false,
            ready: true,
            done: false
          })
        end
      end

      context 'supplying valid attributes' do
        let(:extra_attributes) do
          valid_extra_attributes
        end
        it 'should be valid' do
          expect{ finance_report.mark_completed! }.to_not raise_error
          expect(finance_report.valid?).to eq(true)
        end

        it 'should report being in correct state' do
          finance_report.mark_completed!
          expect(finance_report.current_state).to eq(FinanceReportStateMachine::DONE_STATE.to_s)
          expect(status_methods_hash(finance_report)).to eq({
            requiring_update: false,
            incomplete: false,
            ready: false,
            done: true
          })
        end
      end
    end
  end
end
