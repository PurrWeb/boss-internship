require 'rails_helper'

RSpec.describe RotasController do
  let(:venue) { FactoryGirl.create(:venue) }
  before do
    venue
    allow(request.env['warden']).to receive(:authenticate!).and_return(user)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe '#index' do
    describe 'accessing with no params set' do
      context 'user has no venue associated' do
        let(:user) { FactoryGirl.create(:user, :manager, venues: []) }
        let(:expected_start_date) { Time.zone.now.beginning_of_week.to_date }
        let(:expected_end_date) { Time.zone.now.beginning_of_week.to_date + 6.days }

        it 'should raise error' do
          expect{
            get :index
          }.to raise_error(NoMethodError, /undefined method .id. for nil:NilClass/)
        end
      end

      context 'user has venue assciated' do
        let(:user) { FactoryGirl.create(:user, :manager, venues: [venue]) }
        let(:expected_start_date) { Time.zone.now.beginning_of_week.to_date }
        let(:expected_end_date) { Time.zone.now.beginning_of_week.to_date + 6.days }

        it 'should redirect to index for users default venue with current week dates set' do
          get(:index)
          expect(response).to redirect_to(
            action: :index,
            highlight_date: UIRotaDate.format(expected_start_date),
            venue_id: venue.id
          )
        end
      end
    end

    context 'supplying dates but no venue' do
      let(:user) { FactoryGirl.create(:user, :manager, venues: [venue]) }
      let(:start_date) { Time.zone.now.beginning_of_week.to_date + 7.days }
      let(:end_date) { start_date + 6.days }
      let(:venue) { FactoryGirl.create(:venue) }

      it 'should redirect to index with venue id' do
        get(
          :index,
          highlight_date: UIRotaDate.format(start_date),
          venue_id: nil
        )
        expect(response).to redirect_to(
          action: :index,
          highlight_date: UIRotaDate.format(start_date),
          venue_id: venue.id
        )
      end
    end

    context 'supplying valid dates and venue' do
      let(:user) { FactoryGirl.create(:user, :manager, venues: [venue]) }
      let(:start_date) { Time.zone.now.beginning_of_week.to_date + 7.days }
      let(:end_date) { start_date + 6.days }
      let(:venue) { FactoryGirl.create(:venue) }

      it 'should render the users index' do
        get(
          :index,
          highlight_date: UIRotaDate.format(start_date),
          venue_id: venue.id
        )
        expect(response).to render_template(:index)
      end
    end
  end
end
