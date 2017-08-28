class IncidentReportsAppApiErrors
  def initialize(incident_report)
    @incident_report = incident_report
  end
  attr_reader :incident_report

  def errors
    result = {}
    result[:base] = incident_report.errors[:base] if incident_report.errors[:base].present?

    result[:venueId] = incident_report.errors[:venue] if incident_report.errors[:venue].present?
    result[:incidentTime] = incident_report.errors[:time] if incident_report.errors[:time].present?
    result[:location] = incident_report.errors[:location] if incident_report.errors[:location].present?
    result[:description] = incident_report.errors[:description] if incident_report.errors[:description].present?
    result[:involvedWitnessDetails] = incident_report.errors[:involved_witness_details] if incident_report.errors[:involved_witness_details].present?
    result[:uninvolvedWitnessDetails] = incident_report.errors[:uninvolved_witness_details] if incident_report.errors[:uninvolved_witness_details].present?
    result[:policeOfficerDetails] = incident_report.errors[:police_officer_details] if incident_report.errors[:police_officer_details].present?
    result[:recordedByName] = incident_report.errors[:recorded_by_name] if incident_report.errors[:recorded_by_name].present?
    result[:cameraName] = incident_report.errors[:camera_name] if incident_report.errors[:camera_name].present?
    result[:report] = incident_report.errors[:report_text] if incident_report.errors[:report_text].present?
    result[:disabledAt] = incident_report.errors[:disabled_at] if incident_report.errors[:disabled_at].present?
    result[:disabledByUserId] = incident_report.errors[:disabled_by] if incident_report.errors[:disabled_by].present?
    result
  end
end
