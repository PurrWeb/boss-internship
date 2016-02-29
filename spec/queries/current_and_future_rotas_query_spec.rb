require 'rails_helper'


RSpec.describe CurrentAndFutureRotasQuery do
  let(:now) { Time.now }
  let(:week) { RotaWeek.new(now) }
  let!(:past_rota) { FactoryGirl.create(:rota, date: week.start_date - 1.day) }
  let!(:current_rota_1) { FactoryGirl.create(:rota, date: week.start_date) }
  let!(:current_rota_2) { FactoryGirl.create(:rota, date: week.end_date) }
  let!(:future_rota) { FactoryGirl.create(:rota, date: week.end_date + 1.day) }

  specify 'it should return current and furture rotas' do
    expect(CurrentAndFutureRotasQuery.new(now: now).all).to eq([current_rota_1, current_rota_2, future_rota])
  end
end
