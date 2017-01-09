require 'rails_helper'

describe AccessToken do
  describe 'validation' do
    let(:token_type) { 'web' }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:user) { FactoryGirl.create(:user) }
    let(:token) do
      AccessToken.new(
        token_type: token_type,
        creator: token_creator,
        staff_member: token_staff_member,
        user: token_user
      )
    end

    context 'token created by user' do
      let(:token_creator) { user }
      let(:token_staff_member) { nil }
      let(:token_user) { user }

      specify 'token should be valid' do
        expect(token.valid?).to eq(true)
      end
    end

    context 'token created by staff member' do
      let(:token_creator) { staff_member }
      let(:token_staff_member) { staff_member }
      let(:token_user) { nil }

      specify 'token should be valid' do
        expect(token.valid?).to eq(true)
      end
    end
  end
end
