require 'rails_helper'

RSpec.describe VenuesController do
  let!(:venue) { FactoryGirl.create(:venue, latitude: 5.555555, longitude: 6.666666) }
  let(:user) { FactoryGirl.create(:user, :admin, venues: [venue]) }
  let(:mock_ably_service) { double('ably service') }

  before do
    allow(AblyService).to receive(:new).and_return(mock_ably_service)
    allow(mock_ably_service).to receive(:security_app_data_update)
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
            'longitude' => '',
            'overheads_threshold_percentage' => '',
            'staff_threshold_percentage' => '',
            'security_threshold_percentage' => '',
            'pr_threshold_percentage' => '',
            'kitchen_threshold_percentage' => '',
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
            'longitude' => 5.555555,
            'overheads_threshold_percentage' => '1',
            'staff_threshold_percentage' => '2',
            'security_threshold_percentage' => '3',
            'pr_threshold_percentage' => '4',
            'kitchen_threshold_percentage' => '5',
          }}
        )

        expect(response).to redirect_to(
          action: :index
        )
        expect(venue.reload.latitude).to eq(6.666666)
        expect(venue.reload.longitude).to eq(5.555555)
        expect(venue.overheads_threshold_percentage).to eq(1.0)
        expect(venue.staff_threshold_percentage).to eq(2.0)
        expect(venue.security_threshold_percentage).to eq(3.0)
        expect(venue.pr_threshold_percentage).to eq(4.0)
        expect(venue.kitchen_threshold_percentage).to eq(5.0)
      end
    end
  end
end
