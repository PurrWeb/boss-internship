require 'rails_helper'

describe EmailAddressNotInUse do
  let(:email) { 'test_email_address@fake.com' }
  let!(:email_address) { FactoryGirl.create(:email_address, email: email) }
  let(:query) { EmailAddressNotInUse.new }

  context 'email is unassociated' do
    specify 'email is returned' do
      expect(query.find(email)).to eq(email_address)
    end
  end

  context 'user is assoaciated' do
    let(:user) { FactoryGirl.create(:user, email_address: email_address) }

    before do
      user
    end

    specify 'email is not returned' do
      expect(query.find(email)).to eq(nil)
    end

    context 'user is disabled' do
      before do
        user.update_attributes!(enabled: false)
      end

      specify 'email is returned' do
        expect(query.find(email)).to eq(email_address)
      end
    end
  end

  context 'staff memer is associated' do
    let(:staff_member) { FactoryGirl.create(:staff_member, email_address: email_address) }

    specify 'email is not returned' do
      expect(query.find(email)).to eq(nil)
    end

    context 'staff member is disabled' do
      before do
        staff_member.update_attributes!(enabled: false)
      end

      specify 'email is returned' do
        expect(query.find(email)).to eq(email_address)
      end
    end
  end
end
