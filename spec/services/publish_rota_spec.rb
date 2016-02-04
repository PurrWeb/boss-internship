require 'rails_helper'

describe PublishRotas do
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
  end

  context 'new rotas' do
    let(:rota) { FactoryGirl.build(:rota) }

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
      }.to change{
        rota.persisted?
      }.from(false).to(true)
    end
  end
end
