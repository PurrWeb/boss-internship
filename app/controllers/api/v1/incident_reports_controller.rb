module Api
  module V1
    class IncidentReportsController < APIController
      before_filter :web_token_authenticate!

      def index
        authorize!(:view, :incident_report_page)

        incident_reports = IncidentReportIndexQuery.new(
          venue: venue_from_params,
          start_date: start_date_from_params,
          end_date: end_date_from_params,
          created_by: params[:creatorId],
        ).all

        render(
          json: incident_reports,
          each_serializer: Api::V1::IncidentReports::IncidentReportSerializer,
          status: 200
        )
      end

      def show
        incident_report = IncidentReport.find(params.fetch("id"))
        authorize! :view, incident_report

        render(
          json: incident_report,
          serializer: Api::V1::IncidentReports::IncidentReportSerializer,
          status: 200
        )
      end

      def create
        #Venue specific permission is handled in service call
        authorize!(:create, :incident_reports)

        result = IncidentReportCreationApiService.new(
          requester: current_user,
          venue: venue_from_params
        ).call(
          incident_time: params.fetch("incidentTime").present? ? Time.parse(params.fetch("incidentTime")) : "",
          location: params.fetch("location"),
          description: params.fetch("description"),
          involved_witness_details: params.fetch("involvedWitnessDetails"),
          recorded_by_name: params.fetch("recordedByName"),
          camera_name: params.fetch("cameraName"),
          report_text: params.fetch("report"),
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

      def update
        incident_report = IncidentReport.find(params.fetch("id"))
        authorize!(:update, incident_report)

        result = IncidentReportUpdateApiService.new(
          requester: current_user,
          incident_report: incident_report
        ).call(
          venue_id: params.fetch("venueId"),
          incident_time: Time.parse(params.fetch("incidentTime")),
          location: params.fetch("location"),
          description: params.fetch("description"),
          involved_witness_details: params.fetch("involvedWitnessDetails"),
          recorded_by_name: params.fetch("recordedByName"),
          camera_name: params.fetch("cameraName"),
          report_text: params.fetch("report"),
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

      def destroy
        incident_report = IncidentReport.find(params.fetch("id"))

        authorize!(:destroy, incident_report)

        IncidentReportDisableApiService.new(
          requester: current_user,
          incident_report: incident_report
        ).call!

        render(
          json: {},
          status: 200
        )
      end

      private
      def authorize_admin
        authorize! :manage, :admin
      end

      def start_date_from_params
        result = nil
        begin
          result = UIRotaDate.parse(params[:startDate])
        rescue; end
        result
      end

      def end_date_from_params
        result = nil
        begin
          result = UIRotaDate.parse(params[:endDate])
        rescue; end
        result
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
