class IncidentReportUpdateApiService
  class Result < Struct.new(:success, :incident_report, :api_errors)
    def success?
      success
    end
  end

  def initialize(requester:, incident_report:)
    @requester = requester
    @incident_report = incident_report
    @ability = Ability.new(requester)
  end
  attr_reader :requester, :incident_report, :ability

  def call(params)
    ability.authorize! :manage, incident_report

    result = incident_report.update_attributes(
      venue: Venue.find(params.fetch(:venue_id)),
      time: params.fetch(:incident_time),
      location: params.fetch(:location),
      description: params.fetch(:description),
      involved_witness_details: params.fetch(:involved_witness_details),
      recorded_by_name: params.fetch(:recorded_by_name),
      camera_name: params.fetch(:camera_name),
      report_text: params.fetch(:report_text),
      uninvolved_witness_details: params.fetch(:uninvolved_witness_details),
      police_officer_details: params.fetch(:police_officer_details),
    )

    api_errors = nil
    if !result
      api_errors = IncidentReportsAppApiErrors.new(incident_report)
    end

    Result.new(result, incident_report, api_errors)
  end
end
