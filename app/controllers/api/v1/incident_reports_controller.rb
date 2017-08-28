module Api
  module V1
    class IncidentReportsController < APIController
      before_filter :web_token_authenticate!

      def create
        result = IncidentReportCreationApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).call(
          incident_time: Time.parse(params.fetch("incidentTime")),
          location: params.fetch("location"),
          description: params.fetch("description"),
          involved_witness_details: params.fetch("involvedWitnessDetails"),
          recorded_by_name: params.fetch("recordedByName"),
          camera_name: params.fetch("cameraName"),
          report_text: params.fetch("reportText"),
          uninvolved_witness_details: params.fetch("uninvolvedWitnessDetails"),
          police_officer_details: params.fetch("policeOfficerDetails")
        )

        if result.success?
          render(
            json: result.incident_report,
            serializer: Api::V1::IncidentReports::IncidentReportSerializer,
            status: 200
          )
        else
          render(
            'api/v1/shared/api_errors.json',
            status: 422,
            locals: { api_errors: result.api_errors }
          )
        end
      end

      private

      def authorize_admin
        authorize! :manage, :admin
      end

      def accessible_venues
        AccessibleVenuesQuery.new(current_user).all
      end

      def venue_from_params
        accessible_venues.find_by(id: params.fetch("venueId"))
      end
    end
  end
end
