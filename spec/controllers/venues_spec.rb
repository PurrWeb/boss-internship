require 'rails_helper'

RSpec.describe VenuesController do
  let!(:venue) { FactoryGirl.create(:venue, latitude: 5.555555, longitude: 6.666666) }
  let(:user) { FactoryGirl.create(:user, :admin, venues: [venue]) }

  before do
    allow(request.env['warden']).to receive(:authenticate!).and_return(user)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe '#update' do
    context 'when no params are sent' do
      it 'should not redirect to venues page' do
        put(:update, {
          id: venue.id,
          venue: {
            'name' => '',
            'till_float_cents' => '',
            'safe_float_cents' => '',
            'reminder_user_ids'=>[''],
            'fruit_order_fields'=>[''],
            'latitude' => '',
            'longitude' => ''
          }}
        )

        expect(response).to_not redirect_to(
          action: :index
        )

        expect(venue.reload.latitude).to eq(5.555555)
        expect(venue.reload.longitude).to eq(6.666666)
      end
    end

    context 'when proper params are sent' do
      it 'should redirect to venues page' do
        put(:update, {
          id: venue.id,
          venue: {
            'name' => 'Test',
            'till_float_cents' => 1,
            'safe_float_cents' => 1,
            'reminder_user_ids'=>[''],
            'fruit_order_fields'=>[''],
            'latitude' => 6.666666,
            'longitude' => 5.555555
          }}
        )

        expect(response).to redirect_to(
          action: :index
        )
        expect(venue.reload.latitude).to eq(6.666666)
        expect(venue.reload.longitude).to eq(5.555555)
      end
    end
  end
end