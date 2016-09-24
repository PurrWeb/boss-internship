require 'rails_helper'

describe DailyReport do
  describe "DailyReport.mark_for_update!" do
    let(:venue) { FactoryGirl.create(:venue) }
    let(:date) { Time.current.to_date }

    describe "when report exists" do
      let(:existing_report) do
        DailyReport.create!(
          venue: venue,
          date: date,
          overheads_cents: 0,
          rotaed_cost_cents: 0,
          actual_cost_cents: 0,
          last_update_requested_at: nil
        )
      end

      before do
        existing_report
      end

      context 'before call' do
        specify '1 report should exist' do
          expect(DailyReport.count).to eq(1)
        end
      end

      it 'should not create a new report' do
        DailyReport.mark_for_update!(venue: venue, date: date)
        expect(DailyReport.count).to eq(1)
      end

      it 'should set report for update' do
        DailyReport.mark_for_update!(venue: venue, date: date)

        report = DailyReport.find_by!(venue: venue, date: date)
        expect(report.update_required?).to eq(true)
      end
    end

    describe "when no report exists" do
      context 'before call' do
        specify 'no reports should exist' do
          expect(DailyReport.count).to eq(0)
        end
      end

      it 'should create a new report' do
        DailyReport.mark_for_update!(venue: venue, date: date)
        expect(DailyReport.count).to eq(1)
      end

      describe "new report" do
        it 'should be for correct date and venue' do
          DailyReport.mark_for_update!(venue: venue, date: date)

          report = DailyReport.first
          expect(report.date).to eq(date)
          expect(report.venue).to eq(venue)
        end

        it 'should be set to update' do
          DailyReport.mark_for_update!(venue: venue, date: date)

          report = DailyReport.first
          expect(report.update_required?).to eq(true)
        end
      end
    end
  end
end
