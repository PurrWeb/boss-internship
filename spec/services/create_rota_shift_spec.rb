require 'rails_helper'

describe CreateRotaShift do
  include ActiveSupport::Testing::TimeHelpers

  let(:mock_frontend_updates_service) { double 'mock frontend updates service' }

  before do
    allow(mock_frontend_updates_service).to(receive(:create_shift))
  end

  context 'when no rota exists for given date' do
    let(:params) do
      {
        starts_at: starts_at,
        ends_at: ends_at,
        staff_member: staff_member,
        shift_type: 'normal'
      }
    end
    let(:rota_date) { Time.zone.now.to_date }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:creator) { FactoryGirl.create(:user) }
    let(:authorization_proc) { Proc.new{} }
    let(:service) do
      CreateRotaShift.new(
        creator: creator,
        rota_date: rota_date,
        venue: venue,
        rota_shift_params: params,
        frontend_updates: mock_frontend_updates_service,
        authorization_proc: authorization_proc
      )
    end

    context 'before call' do
      specify 'no rotas exist' do
        expect(Rota.count).to eq(0)
      end

      specify 'no shifts exist' do
        expect(RotaShift.count).to eq(0)
      end
    end

    context 'supplying valid parameters' do
      let(:starts_at) { (rota_date.beginning_of_day + 9.hours).round }
      let(:ends_at) { (rota_date.beginning_of_day + 11.hours).round }

      describe 'result' do
        let(:result) { service.call }

        it 'should be a success' do
          expect(result).to be_success
        end

        it 'should update frontend' do
          expect(mock_frontend_updates_service).to(
            receive(:create_shift).with(
              shift: an_instance_of(RotaShift)
            )
          )
          service.call
        end

        it 'should create a shift' do
          service.call
          expect(RotaShift.count).to eq(1)
        end

        it 'should create a rota' do
          service.call
          expect(Rota.count).to eq(1)
        end

        describe 'returned rota shift' do
          let(:rota_shift) { result.rota_shift }

          it 'should be persisted' do
            expect(rota_shift).to be_persisted
          end

          it 'should have the supplied values' do
            expect(rota_shift.staff_member).to eq(staff_member)
            expect(rota_shift.starts_at).to eq(starts_at)
            expect(rota_shift.ends_at).to eq(ends_at)
          end
        end
      end
    end

    context 'supplying invalid parameters' do
      let(:starts_at) { (Time.zone.now.beginning_of_day + 9.hours).round }
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

          it 'should have the incorrect values' do
            expect(rota_shift.ends_at).to eq(ends_at)
          end
        end
      end
    end
  end

  context 'rota exists for given date' do
    let(:params) do
      {
        starts_at: starts_at,
        ends_at: ends_at,
        staff_member: staff_member,
        shift_type: 'normal'
      }
    end
    let(:rota_date) { 2.days.ago.to_date }
    let(:venue) { FactoryGirl.create(:venue) }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:rota_shift_creator) { FactoryGirl.create(:user) }
    let(:rota_creator) { FactoryGirl.create(:user) }
    let(:rota_create_time) { Time.zone.now.round }
    let(:authorization_proc) { Proc.new{} }
    let!(:rota) do
      travel_to rota_create_time do
        FactoryGirl.create(
          :rota,
          date: rota_date,
          venue: venue,
          creator: rota_creator
        )
      end
    end

    let(:service) do
      CreateRotaShift.new(
        creator: rota_shift_creator,
        rota_date: rota_date,
        venue: venue,
        rota_shift_params: params,
        frontend_updates: mock_frontend_updates_service,
        authorization_proc: authorization_proc
      )
    end

    context 'before call' do
      specify '1 rota exists' do
        expect(Rota.count).to eq(1)
      end

      specify 'no shifts exist' do
        expect(RotaShift.count).to eq(0)
      end

      specify 'staff member does not require notification' do
        expect(staff_member.requires_notification?).to eq(false)
      end
    end

    context 'supplying valid parameters' do
      let(:starts_at) { (rota_date.beginning_of_day + 9.hours).round }
      let(:ends_at) { (rota_date.beginning_of_day + 11.hours).round }

      describe 'result' do
        let(:result) { service.call }

        it 'should be a success' do
          expect(result).to be_success
        end

        it 'should update frontend' do
          expect(mock_frontend_updates_service).to(
            receive(:create_shift).with(
              shift: an_instance_of(RotaShift)
            )
          )
          service.call
        end

        it 'should create a shift' do
          service.call
          expect(RotaShift.count).to eq(1)
        end

        it 'should not create a rota' do
          service.call
          expect(Rota.count).to eq(1)
        end

        specify 'returned rota shift should be assocaited with the supplied rota' do
          expect(result.rota_shift.rota).to eq(rota)
        end

        specify 'rota was not updated' do
          expect(rota.updated_at).to eq(rota_create_time)
          expect(rota.creator).to eq(rota_creator)
          expect(rota.date).to eq(rota_date)
        end

        specify 'staff member does not require notification' do
          service.call
          expect(staff_member.reload.requires_notification?).to eq(false)
        end
      end
    end

    context 'rota is published' do
      let(:starts_at) { (rota_date.beginning_of_day + 9.hours).round }
      let(:ends_at) { (rota_date.beginning_of_day + 11.hours).round }
      let!(:rota) do
        travel_to rota_create_time do
          FactoryGirl.create(
            :rota,
            :published,
            date: rota_date,
            venue: venue,
            creator: rota_creator
          )
        end
      end

      specify 'staff member is marked as requiring notification' do
        service.call
        expect(staff_member.reload.requires_notification?).to eq(true)
      end
    end
  end
end
