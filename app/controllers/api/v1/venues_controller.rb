module Api
  module V1
    class VenuesController < APIController
      def show
        venue = Venue.find(params.fetch(:id))
        authorize!(:manage, venue)

        render locals: { venue: venue }
      end
    end
  end
end
