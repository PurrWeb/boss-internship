require 'rails_helper'

describe ApiKey do
  let(:venue) { FactoryGirl.create(:venue) }
  let(:user) { FactoryGirl.create(:user, venues: [venue]) }

  describe 'key modification' do
    specify 'saving should set the key' do
      key = ApiKey.new
      expect(key.key).to eq(nil)
      key.update_attributes!(venue: venue, user: user)
      expect(key.key).to match(/[a-f0-9]+/)
    end

    specify 'modifying existing key should fail validation' do
      key = ApiKey.create!(venue: venue, user: user)
      expect(key.update_attributes(key: 'new_key')).to eq(false)
      expect(key.errors[:key]).to eq(["can't be modified"])
    end
  end

  describe 'duplicate contraint' do
    context 'venue has existing active key' do
      let!(:key) { ApiKey.create(venue: venue, user: user) }

      specify 'adding key for venue should fail' do
        new_key = ApiKey.new(venue: venue, user: user)
        expect(new_key.save).to eq(false)
        expect(new_key.errors[:base]).to eq(
          ["venue already has an active api key"]
        )
      end
    end

    context 'venue has existing deleted key' do
      let!(:key) { ApiKey.create(venue: venue, user: user) }

      specify 'adding key for venue should fail' do
        key.state_machine.transition_to!(:deleted, requster_user_id: user.id)

        new_key = ApiKey.new(venue: venue, user: user)
        expect(new_key.save).to eq(true)
      end
    end
  end
end
