require 'rails_helper'

RSpec.describe 'SetAccessoryStockLevel service'  do
  let(:now) { Time.current + 1.week }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, :admin) }
  let!(:accessory) do
    FactoryGirl.create(:accessory, venue: venue)
  end
  let(:previous_count) { -5 }
  let(:previous_delta) { -5 }
  let!(:accessory_restock) do
    FactoryGirl.create(:accessory_restock, accessory: accessory, created_by_user: user, count: previous_count, delta: previous_delta)
  end
  let(:count) { 10 }
  let(:expected_delta) { 15 }
  let(:expected_count) { previous_count + expected_delta }
  let(:service) do
    SetAccessoryStockLevel.new(
      accessory: accessory,
      count: count,
      requester: user
    )
  end

  context 'after call' do
    let!(:result) { service.call }

    it 'should succeed' do
      expect(result).to be_success
    end

    it 'accessory restocks should be created' do
      expect(accessory.accessory_restocks.count).to eq(2)
    end

    it 'accessory restocks count should be correct' do
      expect(result.accessory_restock.count).to eq(expected_count)
    end

    it 'accessory restocks delta should be correct' do
      expect(result.accessory_restock.delta).to eq(expected_delta)
    end
  end
end
