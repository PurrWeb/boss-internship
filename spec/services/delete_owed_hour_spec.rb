require 'rails_helper'

RSpec.describe 'DeleteOwedHour service'  do
  let(:requester) { FactoryGirl.create(:user) }
  let(:owed_hour) { FactoryGirl.create(:owed_hour) }
  let(:service) do
    DeleteOwedHour.new(
      requester: requester,
      owed_hour: owed_hour
    )
  end

  context 'before call' do
    specify 'owed_hour should be enabled' do
      expect(owed_hour.disabled?).to eq(false)
    end
  end

  context 'after call' do
    before do
      service.call
    end

    specify 'owed_hour is disabled' do
      expect(owed_hour.disabled?).to eq(true)
    end

    specify 'owed_hour disabled_by is requester' do
      expect(owed_hour.disabled_by).to eq(requester)
    end
  end

  context 'owed_hour is frozen' do
    let(:finance_report) do
      FactoryGirl.create(:finance_report).tap do |finance_report|
        finance_report.mark_ready!
        finance_report.allow_mark_completed = true
        finance_report.mark_completed!
      end
    end
    let(:owed_hour) do
      FactoryGirl.create(
        :owed_hour,
        finance_report: finance_report
      )
    end
    let(:result) { service.call }

    before do
      result
    end

    it 'should not be a success' do
      expect(result).to_not be_success
    end

    specify 'it should return base error' do
      expect(result.owed_hour.errors[:base]).to eq(["can't delete owed hour that has been frozen"])
    end
  end
end
