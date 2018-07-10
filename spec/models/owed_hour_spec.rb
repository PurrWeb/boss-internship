require 'rails_helper'

describe OwedHour do
  include ActiveSupport::Testing::TimeHelpers

  describe 'validation' do
    context 'creation' do
      let(:now) { Time.current }
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:user) { FactoryGirl.create(:user) }
      let(:date) { RotaShiftDate.to_rota_date(now - 1.week) }
      let(:payslip_week) { RotaWeek.new(date + 1.week) }
      let(:note) { 'Test note' }
      let(:starts_at) { RotaShiftDate.new(date).start_time }
      let(:ends_at) { starts_at + 2.hours }
      let(:minutes) { (ends_at - starts_at) / 60 }
      let(:owed_hour) do
        OwedHour.new(
          staff_member: staff_member,
          payslip_date: payslip_week.start_date,
          date: date,
          starts_at: starts_at,
          ends_at: ends_at,
          minutes: minutes,
          creator: user,
          note: note
        )
      end

      specify 'owed_hour should be valid' do
        expect(owed_hour).to be_valid
      end

      context 'payslip date is in the past on creation' do
        let(:payslip_week) { RotaWeek.new((now - 3.weeks).to_date) }

        specify 'should not be valid' do
          owed_hour.validate_as_creation = true
          expect(owed_hour.save).to eq(false)
          expect(owed_hour.errors[:payslip_date]).to eq(["can't be in the past"])
        end
      end

      context 'owed_hour aready exists at conflicting time' do
        before do
          OwedHour.create!(
            staff_member: staff_member,
            payslip_date: payslip_week.start_date,
            date: date,
            starts_at: starts_at,
            ends_at: ends_at,
            minutes: minutes,
            creator: user,
            note: note
          )
        end

        specify 'owed hour should not be valid' do
          expect(owed_hour).to_not be_valid
        end

        specify 'error should appear on base' do
          owed_hour.valid?
          expect(owed_hour.errors[:base]).to eq(['conflicting owed hour exists'])
        end
      end

      context 'accepted HoursAcceptancePeriod aready exists at conflicting time' do
        before do
          clock_in_day = ClockInDay.create!(
            staff_member: staff_member,
            date: date,
            creator: user,
            venue: staff_member.master_venue
          )

          HoursAcceptancePeriod.create!(
            status: HoursAcceptancePeriod::ACCEPTED_STATE,
            accepted_by_id: user.id,
            accepted_at: now,
            clock_in_day: clock_in_day,
            starts_at: starts_at,
            ends_at: ends_at,
            creator: user
          )
        end

        specify 'owed hour should not be valid' do
          expect(owed_hour).to_not be_valid
        end

        specify 'error should appear on base' do
          owed_hour.valid?
          expect(owed_hour.errors[:base]).to eq(['conflicting hour acceptance exists'])
        end
      end

      context 'Holiday exists at conflicting time' do
        let(:holiday_create_time) { date - 2.weeks }
        before do
          travel_to holiday_create_time do
            FactoryGirl.create(
              :holiday,
              payslip_date: payslip_week.start_date,
              staff_member: staff_member,
              start_date: date,
              end_date: date
            )
          end
        end

        before 'owed hour should not be valid' do
          expect(owed_hour).to_not be_valid
        end

        specify 'error should appear on base' do
          owed_hour.valid?
          expect(owed_hour.errors[:base]).to eq(['conflicting holiday exists'])
        end
      end

      context 'HolidayRequest exists at conflicting time' do
        let(:holiday_request_create_time) { date - 2.weeks }
        before do
          travel_to holiday_request_create_time do
            FactoryGirl.create(
              :holiday_request,
              staff_member: staff_member,
              start_date: date,
              end_date: date
            )
          end
        end

        specify 'owed hour should not be valid' do
          expect(owed_hour).to_not be_valid
        end

        specify 'error should appear on base' do
          owed_hour.valid?
          expect(owed_hour.errors[:base]).to eq(['conflicting holiday request exists'])
        end
      end
    end

    context 'update' do
      let(:now) { Time.current }
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let(:user) { FactoryGirl.create(:user) }
      let(:date) { RotaShiftDate.to_rota_date(now - 1.week) }
      let(:payslip_week) { RotaWeek.new(date + 1.week) }
      let(:note) { 'Test note' }
      let(:starts_at) { RotaShiftDate.new(date).start_time }
      let(:ends_at) { starts_at + 2.hours }
      let(:minutes) { (ends_at - starts_at) / 60 }
      let(:owed_hour) do
        OwedHour.create!(
          staff_member: staff_member,
          payslip_date: payslip_week.start_date,
          date: date,
          starts_at: starts_at,
          ends_at: ends_at,
          minutes: minutes,
          creator: user,
          note: note
        )
      end

      context 'changing payslip date tot the past' do
        specify 'should not be valid' do
          expect(owed_hour.update_attributes(payslip_date: payslip_week.start_date - 4.weeks)).to eq(false)
          expect(owed_hour.errors[:payslip_date]).to eq(["can't be in the past"])
        end
      end
    end
  end
end
