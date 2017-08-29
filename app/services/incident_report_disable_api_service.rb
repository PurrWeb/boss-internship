class IncidentReportDisableApiService
  def initialize(requester:, incident_report:, now: Time.current)
    @requester = requester
    @incident_report = incident_report
    @now = now
    @ability = Ability.new(requester)
  end
  attr_reader :requester, :incident_report, :ability, :now

  def call!
    ability.authorize! :manage, incident_report.venue

    incident_report.update_attributes!(
      disabled_by: requester,
      disabled_at: now
    )
  end
end
