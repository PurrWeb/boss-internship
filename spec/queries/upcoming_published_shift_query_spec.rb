require 'rails_helper'

RSpec.describe UpcomingPublishedShiftQuery do
  include ActiveSupport::Testing::TimeHelpers

  # 12:00am
  let(:now) { Time.now.beginning_of_day + 12.hours }
  around(:each) do |example|
    travel_to now do
      example.run
    end
  end

  let(:query) { UpcomingPublishedShiftQuery.new(staff_member: staff_member) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:rota) do
    FactoryGirl.create(
      :rota,
      :published,
      date: now.to_date
    )
  end
  let(:rota_shift) do
    FactoryGirl.create(
      :rota_shift,
      staff_member: staff_member,
      starts_at: now + 1.hour,
      ends_at: now + 2.hours,
      rota: rota
    )
  end

  before do
    rota_shift
  end

  specify do
    expect(query.all).to eq([rota_shift])
  end

  context 'shift is disabled' do
    before do
      rota_shift.update_attributes!(enabled: false)
    end

    it 'should not appear in the results' do
      expect(query.all).to eq([])
    end
  end

  context 'shift is in the past' do
    let(:rota_shift) do
      travel_to(now - 1.week) do
        FactoryGirl.create(
          :rota_shift,
          staff_member: staff_member
        )
      end
    end

    it 'should not appear in the results' do
      expect(query.all).to eq([])
    end
  end

  context 'shifts rota is not published' do
    let(:rota) do
      FactoryGirl.create(
        :rota,
        :finished,
        date: now.to_date
      )
    end

    it 'should not appear in the results' do
      expect(query.all).to eq([])
    end
  end
end
