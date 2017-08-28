class Api::V1::IncidentReports::IncidentReportSerializer < ActiveModel::Serializer
  attributes  :id, :venueId, :incidentTime, :location, :description, :involvedWitnessDetails, :uninvolvedWitnessDetails, :policeOfficerDetails, :recordedByName, :cameraName, :report, :disabledAt, :disabledByUserId

  def venueId
    object.venue.id
  end

  def created_at
    object.created_at.iso8601
  end

  def incidentTime
    object.time.andand.iso8601
  end

  def involvedWitnessDetails
    object.involved_witness_details
  end

  def uninvolvedWitnessDetails
    object.uninvolved_witness_details
  end

  def policeOfficerDetails
   object.police_officer_details
  end

  def recordedByName
    object.user.full_name
  end

  def cameraName
    object.camera_name
  end

  def disabledAt
    object.disabled_at.andand.iso8601
  end

  def disabledByUserId
    object.disabled_by.andand.id
  end

  def report
    object.report_text
  end
end
