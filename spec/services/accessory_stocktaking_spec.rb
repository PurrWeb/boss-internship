require 'rails_helper'

RSpec.describe 'AccessoryStocktaking service'  do
  let(:now) { Time.current + 1.week }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, :admin) }
  let!(:accessory) do
    FactoryGirl.create(:accessory, venue: venue)
  end
  let!(:accessory_restock) do
    FactoryGirl.create(:accessory_restock, accessory: accessory, created_by_user: user, count: -5, delta: -4)
  end
  let(:count) { 10 }
  let(:service) do
    AccessoryStocktaking.new(
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

    it 'accessory restocks data should be seccess' do
      expect(result.accessory_restock.count).to eq(10)
      expect(result.accessory_restock.delta).to eq(15)
    end
  end
end
