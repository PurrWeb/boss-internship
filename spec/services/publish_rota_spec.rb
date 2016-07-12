require 'rails_helper'

describe PublishRotas do
  include ActiveSupport::Testing::TimeHelpers

  around(:each) do |example|
    travel_to Time.zone.now do
      example.run
    end
  end

  let(:service) { PublishRotas.new(rotas: rotas) }
  let(:rotas) { [rota] }

  context 'existing rotas' do
    let(:rota)  { FactoryGirl.create(:rota) }

    specify 'Should update the rotas status' do
      expect{
        service.call
      }.to change{
        rota.status
      }.from("in_progress").to("published")
    end

    specify 'not save the rota models' do
      expect{
        service.call
      }.to_not change{
        rota.updated_at
      }
    end

    context 'with shifts' do
      let(:staff_member) { FactoryGirl.create(:staff_member) }
      let!(:rota_shift) do
        FactoryGirl.create(
          :rota_shift,
          rota: rota,
          staff_member: staff_member,
          starts_at: RotaShiftDate.new(rota.date).start_time,
          ends_at: RotaShiftDate.new(rota.date).start_time + 2.hours
        )
      end

      specify 'Should update the rotas status' do
        expect{
          service.call
        }.to change{
          staff_member.reload.shift_change_occured_at
        }.from(nil).to(Time.zone.now)
      end
    end
  end

  context 'new rotas' do
    let(:rota) { FactoryGirl.build(:rota) }

    specify 'Should update the rotas status' do
      expect{
        service.call
      }.to raise_error(Exception)
    end
  end
end
