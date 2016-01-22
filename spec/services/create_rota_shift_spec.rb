require 'rails_helper'

describe CreateRotaShift do
  let(:params) do
    {
      starts_at: starts_at,
      ends_at: ends_at,
      staff_member: staff_member
    }
  end
  let(:rota) { FactoryGirl.create(:rota) }
  let(:staff_member) { FactoryGirl.create(:staff_member) }
  let(:creator) { FactoryGirl.create(:user) }

  let(:service) do
    CreateRotaShift.new(
      creator: creator,
      rota: rota,
      rota_shift_params: params
    )
  end

  specify 'before call no shifts exist' do
    expect(RotaShift.count).to eq(0)
  end

  context 'supplying valid parameters' do
    let(:starts_at) { (Time.now.beginning_of_day + 3.hours).round }
    let(:ends_at) { (Time.now.beginning_of_day + 5.hours).round }

    describe 'result' do
      let(:result) { service.call }

      it 'should be a success' do
        expect(result).to be_success
      end

      it 'should create a shift' do
        service.call
        expect(RotaShift.count).to eq(1)
      end

      describe 'returned rota shift' do
        let(:rota_shift) { result.rota_shift }

        it 'should be persisted' do
          expect(rota_shift).to be_persisted
        end

        it 'should have the supplied values' do
          expect(rota_shift.starts_at).to eq(starts_at)
          expect(rota_shift.ends_at).to eq(ends_at)
        end
      end
    end
  end

  context 'supplying invalid parameters' do
    let(:starts_at) { (Time.now.beginning_of_day + 3.hours).round }
    let(:ends_at) { nil }

    describe 'result' do
      let(:result) { service.call }

      it 'should not be success' do
        expect(result).to_not be_success
      end

      it 'should not create a shift' do
        service.call
        expect(RotaShift.count).to eq(0)
      end

      describe 'returned rota shift' do
        let(:rota_shift) { result.rota_shift }

        it 'should not be persisted' do
          expect(rota_shift).to_not be_persisted
        end

        it 'should have the supplied values' do
          expect(rota_shift.starts_at).to eq(starts_at)
          expect(rota_shift.ends_at).to eq(ends_at)
        end
      end
    end
  end
end
