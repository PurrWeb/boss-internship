require 'rails_helper'

RSpec.describe 'CreateAccessoryRestock service'  do
  let(:now) { Time.current + 1.week }
  let!(:venue) { FactoryGirl.create(:venue) }
  let!(:user) { FactoryGirl.create(:user, :admin) }
  let!(:accessory) do
    FactoryGirl.create(:accessory, venue: venue)
  end
  let(:count) { 10 }
  let(:delta) { -4 }
  let(:service) do
    CreateAccessoryRestock.new(params: {
        accessory: accessory,
        count: count,
        delta: delta,
        created_by_user: user
      }
    )
  end

  context 'before call' do
    specify 'no accessory restocks for given accessory' do
      expect(accessory.accessory_restocks.count).to eq(0)
    end
  end

  context 'after call' do
    let!(:result) { service.call }

    it 'should succeed' do
      expect(result).to be_success
    end

    it 'accessory restocks should be created' do
      expect(accessory.accessory_restocks.count).to eq(1)
    end

    it 'accessory restocks data should be seccess' do
      expect(result.accessory_restock.count).to eq(10)
      expect(result.accessory_restock.delta).to eq(-4)
    end
  end
end
