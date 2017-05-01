class Api::V1::UploadSerializer < ActiveModel::Serializer
  attributes :id, :url

  def url
    object.file.url
  end
end
