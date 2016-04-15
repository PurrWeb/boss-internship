require 'rails_helper'

RSpec.describe RotaShiftsByWeek do
  subject { RotaShiftsByWeek.new(shifts) }

  context 'when no shifts supplied' do
    let(:shifts) { [] }

    specify do
      expect(subject.count).to eq(0)
    end

    specify do
      expect(subject.to_a).to eq([])
    end
  end

  context 'shifts in same week' do
    let(:week) { RotaWeek.new(Time.zone.now) }
    let(:shifts) do
      Array.new(2) do
        FactoryGirl.build(
          :rota_shift,
          starts_at: week.start_date + 8.hours,
          ends_at: week.start_date + 10.hours
        )
      end
    end

    specify do
      expect(subject.count).to eq(1)
    end

    specify do
      expect{ |b| subject.each(&b) }.to yield_with_args([week, shifts])
    end
  end

  context 'shifts in different weeks' do
    let(:weeks) { [RotaWeek.new(Time.zone.now), RotaWeek.new(Time.zone.now + 1.week)] }
    let(:shifts) do
      weeks.map do |week|
        FactoryGirl.build(
          :rota_shift,
          starts_at: week.start_date + 8.hours,
          ends_at: week.start_date + 10.hours
        )
      end
    end

    specify do
      expect(subject.count).to eq(2)
    end

    specify do
      expect{ |b| subject.each(&b) }.to yield_successive_args([weeks[0], [shifts[0]]], [weeks[1], [shifts[1]]])
    end
  end
end
