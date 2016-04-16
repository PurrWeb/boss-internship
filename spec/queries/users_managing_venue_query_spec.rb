require 'rails_helper'

RSpec.describe UsersManagingVenueQuery do
  let(:query) { UsersManagingVenueQuery.new(venue: venue) }
  let(:venue) { FactoryGirl.create(:venue) }

  before do
    venue
  end

  context 'when admin exists' do
    let(:admin) do
      FactoryGirl.create(:user, :admin)
    end

    before do
      admin
    end

    it 'should be returned' do
      expect(query.all).to eq([admin])
    end
  end

  context 'when venue\'s manager exists' do
    let(:user) do
      name = FactoryGirl.create(:name, first_name: 'venue manger')
      FactoryGirl.create(:user, name: name, venues: [venue])
    end

    before do
      user
    end

    it 'should be returned' do
      expect(query.all).to eq([user])
    end
  end

  context 'when non venue manager exists' do
    let(:other_venue) do
      FactoryGirl.create(:venue)
    end
    let(:user) do
      name = FactoryGirl.create(:name, first_name: 'non venue manger')
      FactoryGirl.create(
        :user,
        name: name,
        venues: [other_venue]
      )
    end

    before do
      other_venue
      user
    end

    it 'should not be returned' do
      expect(query.all).to eq([])
    end
  end
end
