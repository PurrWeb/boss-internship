require 'rails_helper'

describe EmailAddress do
  let(:subject) { EmailAddress.new(email: email) }

  describe 'email format validation' do
    context 'email with whitespace at ends' do
      let(:email) { '   bill@test.com     ' }

      it 'should be valid' do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          []
        )
      end
    end

    context 'no email supplied' do
      let(:email) { nil }

      it do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          ["can't be blank"]
        )
      end
    end

    context 'email contains space' do
      let(:email) { 'john @crap.com' }

      it do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          [EmailAddress.invalid_email_address_message]
        )
      end
    end

    context 'email does not conatin @' do
      let(:email) { 'johncrap.com' }

      it do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          [EmailAddress.invalid_email_address_message]
        )
      end
    end

    context 'email starts with @' do
      let(:email) { '@johncrap.com' }

      it do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          [EmailAddress.invalid_email_address_message]
        )
      end
    end

    context 'email ends with @' do
      let(:email) { 'johncrap.com@' }

      it do
        subject.valid?
        expect(
          subject.errors[:email]
        ).to eq(
          [EmailAddress.invalid_email_address_message]
        )
      end
    end
  end
end
