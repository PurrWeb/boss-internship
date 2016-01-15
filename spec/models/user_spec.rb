require 'rails_helper'

describe User do
  describe 'associations' do
    describe '#venues' do
      let!(:user) { FactoryGirl.create(:user) }

      specify do
        expect(user.venues).to eq([])
      end

      context 'when user is assocaited with venue' do
        let!(:venue) { FactoryGirl.create(:venue) }

        before do
          user.update_attributes!(venues: [venue])
        end

        specify 'it should be listed' do
          expect(user.reload.venues).to eq([venue])
        end
      end
    end
  end
end
