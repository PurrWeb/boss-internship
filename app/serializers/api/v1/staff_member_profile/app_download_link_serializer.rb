class Api::V1::StaffMemberProfile::AppDownloadLinkSerializer < ActiveModel::Serializer
  attributes :download_url, :last_sent_at, :app_name, :mobile_app_id
end
