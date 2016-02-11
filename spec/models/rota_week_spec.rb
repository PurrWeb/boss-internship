require 'rails_helper'

def _monday
  Date.parse('28/02/1983')
end

def _week_days
  Array.new(7) do |index|
    _monday + index.days
  end
end

RSpec.describe RotaWeek do
  let(:week) { RotaWeek.new(supplied_day) }
  let(:week_days) { _week_days }
  let(:monday) { _monday }
  let(:sunday) { week_days.last }

  _week_days.each do |day|
    # Prints Day name
    context "Supplying #{day.strftime('%A')}" do
      let(:supplied_day) { day }

      specify 'should produce Monday that week as start date' do
        expect(week.start_date).to eq(monday)
      end

      specify 'should produce Sunday that week as end date' do
        expect(week.end_date).to eq(sunday)
      end
    end
  end
end
