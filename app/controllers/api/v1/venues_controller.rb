module Api
  module V1
    class VenuesController < APIController
      before_filter :web_token_authenticate!

      def show
        venue = Venue.find(params.fetch(:id))
        authorize!(:manage, venue)

        render locals: { venue: venue }
      end
    end
  end
end
