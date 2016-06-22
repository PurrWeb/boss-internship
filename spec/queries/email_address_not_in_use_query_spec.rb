require 'rails_helper'

describe EmailAddressNotInUseQuery do
  let(:email_address) do
    FactoryGirl.create(:email_address, email: 'my_email@foo.com')
  end
  let(:query) { EmailAddressNotInUseQuery.new }

  before do
    email_address
  end

  specify 'email should not be returned' do
    expect(query.all).to include(email_address)
  end

  context 'user exists with email' do
    let(:user) { FactoryGirl.create(:user, email_address: email_address)}
    before do
      user
    end

    specify 'email should be returned' do
      expect(query.all).to_not include(email_address)
    end

    context 'user is disabled' do
      let(:user) do
        FactoryGirl.create(
          :user,
          :disabled,
          email_address: email_address
        )
      end

      specify 'email should not be returned' do
        expect(query.all).to include(email_address)
      end
    end
  end

  context 'staff_member exists with email' do
    let(:staff_member) do
      FactoryGirl.create(
        :staff_member,
        email_address: email_address
      )
    end
    before do
      staff_member
    end

    specify 'email should be returned' do
      expect(query.all).to_not include(email_address)
    end

    context 'staff_member is disabled' do
      let(:staff_member) do
        FactoryGirl.create(
          :staff_member,
          :disabled,
          email_address: email_address
        )
      end

      specify 'email should not be returned' do
        expect(query.all).to include(email_address)
      end
    end
  end
end
