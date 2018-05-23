class Api::V1::MaintenanceTasks::UploadSerializer < ActiveModel::Serializer
  attributes :id, :url

  def url
    object.file.url
  end
end
