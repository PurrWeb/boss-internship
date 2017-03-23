module ApplicationHelper
  def api_v1_collection_json(collection, serializer, scopes = nil)
    ActiveModel::Serializer::CollectionSerializer.new(
      collection,
      serializer: serializer,
      scopes: scopes
    ).to_json.html_safe
  end
end
