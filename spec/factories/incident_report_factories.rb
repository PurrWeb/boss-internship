FactoryGirl.define do
  factory :incident_report do
    venue
    user
    time Time.current
    location "Some where"
    description "Some description"
    involved_witness_details "Some involved witness details"
    uninvolved_witness_details "Some uninvolved_witness_details"
    police_officer_details "Some police_officer_details"
    recorded_by_name "Some recorded by name"
    camera_name "Some camera name"
    report_text "Some report text"
  end
end
