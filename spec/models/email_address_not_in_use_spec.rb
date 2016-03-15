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

  context 'staff member is associated' do
    let(:staff_member) { FactoryGirl.create(:staff_member, email_address: email_address) }

    before do
      staff_member
    end

    specify 'email is not returned' do
      expect(query.find(email)).to eq(nil)
    end

    context 'staff member is disabled' do
      let(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          :disabled,
          email_address: email_address
        )
      end

      specify 'email is returned' do
        expect(query.find(email)).to eq(email_address)
      end
    end
  end
end
