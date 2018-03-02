require 'rails_helper'

describe Payment do
  describe 'Creating a payment' do
    let(:date) { Time.current.to_date - 2.weeks }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:creator) { FactoryGirl.create(:user) }
    let(:cents) { 21312 }

    it 'should be pending by default' do
      payment = Payment.create!(
        staff_member: staff_member,
        date: date,
        cents: cents,
        created_by_user: creator
      )
      expect(payment.current_state).to eq("pending")
    end

    it 'should be not be disabled' do
      payment = Payment.create!(
        staff_member: staff_member,
        date: date,
        cents: cents,
        created_by_user: creator
      )
      expect(payment.disabled?).to eq(false)
    end

    it 'should match enabled scope' do
      payment = Payment.create!(
        staff_member: staff_member,
        date: date,
        cents: cents,
        created_by_user: creator
      )
      expect(Payment.enabled.all.to_a).to eq([payment])
    end

    it 'should not match disabled scope' do
      Payment.create!(
        staff_member: staff_member,
        date: date,
        cents: cents,
        created_by_user: creator
      )
      expect(Payment.disabled.all.to_a).to eq([])
    end
  end

  describe 'disabling a payment' do
    let(:date) { Time.current.to_date - 2.weeks }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:creator) { FactoryGirl.create(:user) }
    let(:cents) { 21312 }
    let(:payment) do
      Payment.create!(
        staff_member: staff_member,
        date: date,
        cents: cents,
        created_by_user: creator
      )
    end

    before do
      payment
      payment.update_attributes(
        disabled_by_user: disabler,
        disabled_at: disabled_at
      )
    end

    context 'with valid params' do
      let(:disabler) { FactoryGirl.create(:user) }
      let(:disabled_at) { Time.current + 5.minutes }

      it 'should be valid' do
        expect(payment.reload).to be_valid
      end

      it 'should set the disable user ' do
        expect(payment.reload.disabled_by_user).to eq(disabler)
      end

      it 'should set the disabled_at_time' do
        expect(payment.reload.disabled_at).to eq(disabled_at.round)
      end

      it 'should change current status' do
        expect(payment.reload.current_state).to eq("disabled")
      end

      it 'should disable the staff member' do
        expect(payment.reload.disabled?).to eq(true)
      end

      it 'should show up in disabled scope' do
        expect(Payment.disabled.all.to_a).to eq([payment])
      end

      it 'should not show up in enabled scope' do
        expect(Payment.enabled.all.to_a).to eq([])
      end
    end
  end
end
