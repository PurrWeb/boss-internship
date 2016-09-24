require 'rails_helper'

describe DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery do
  let(:now) { Time.current }
  let(:master_venue) { FactoryGirl.create(:venue) }
  let(:staff_member) { FactoryGirl.create(:staff_member, master_venue: master_venue) }
  let(:subject) do
    DailyReportDatesEffectedByStaffMemberOnWeeklyPayRateQuery.new(
      staff_member: staff_member
    )
  end

  context 'rota exists for master venue' do
    let(:rota) do
      FactoryGirl.create(:rota, date: rota_date, venue: master_venue)
    end

    before do
      rota
    end

    context 'rota is in future week' do
      let(:next_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) + 1.week) }
      let(:rota_date) { next_week.start_date }

      it 'should return date with venue for rota' do
        expect(
          subject.to_a
        ).to include([rota.date, rota.venue])
      end
    end

    context 'rota is in the current week' do
      let(:current_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now)) }
      let(:rota_date) { current_week.start_date }

      it 'should return date with venue for rota' do
        expect(
          subject.to_a
        ).to include([rota.date, rota.venue])
      end
    end

    context 'rota is in past week' do
      let(:past_week) { RotaWeek.new(RotaShiftDate.to_rota_date(now) - 1.week) }
      let(:rota_date) { past_week.end_date }

      it 'should not return date with venue for rota' do
        expect(
          subject.to_a
        ).to eq([])
      end
    end
  end
end
