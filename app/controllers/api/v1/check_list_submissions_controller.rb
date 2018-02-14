module Api
  module V1
    class CheckListSubmissionsController < APIController
      before_filter :web_token_authenticate!
      before_filter :check_venue

      def index
        authorize! :view, :check_list_submissions_page

        result = ChecklistSubmissionsIndexFilter.new(user: current_user, params: params)
        query = result.checklist_submissions_index_query
        submissions = query
          .all
          .includes(:check_list_submission_answers)
          .includes(:user)

        submissions_page_data = ChecklistSubmissionsPageData.new(submissions: submissions, params: params)

        render json: {
          current_venue: Api::V1::VenueForSelectSerializer.new(venue_from_params),
        }.merge(submissions_page_data.get_data)
      end

      private

      def check_venue
        unless venue_from_params.present?
          render json: {}, status: :unprocessable_entity
        end
      end

      def venue_params
        params.permit(:venue_id)
      end

      def venue_from_params
        if current_user.has_all_venue_access?
          Venue.find_by({id: venue_params.fetch(:venue_id)})
        else
          current_user.venues.find(venue_params.fetch(:venue_id))
        end
      end
    end
  end
end
