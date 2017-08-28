class IncidentReportCreationApiService
  class Result <  Struct.new(:incident_report, :success, :api_errors)
    def success?
      success
    end
  end

  def initialize(requester:, venue:)
    @requester = requester
    @venue = venue
    @ability = Ability.new(requester)
  end
  attr_reader :requester, :venue, :ability

  def call(params)
    ability.authorize! :manage, venue

    incident_report = IncidentReport.new(
      user: requester,
      venue: venue,
      time: params.fetch(:incident_time),
      location: params.fetch(:location),
      description: params.fetch(:description),
      involved_witness_details: params.fetch(:involved_witness_details),
      recorded_by_name: params.fetch(:recorded_by_name),
      camera_name: params.fetch(:camera_name),
      report_text: params.fetch(:report_text),
      uninvolved_witness_details: params.fetch(:uninvolved_witness_details),
      police_officer_details: params.fetch(:police_officer_details)
    )

    result = incident_report.save

    api_errors = nil
    if !result
      api_errors = IncidentReportsAppApiErrors.new(incident_report)
    end

    Result.new(incident_report, result, api_errors)
  end
end
