module ApplicationHelper
  def api_v1_collection_json(collection, serializer)
    ActiveModel::Serializer::CollectionSerializer.new(
      collection,
      serializer: serializer
    ).to_json.html_safe
  end
end
