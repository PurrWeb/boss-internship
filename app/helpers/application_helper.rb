module ApplicationHelper
  def api_v1_collection_json(collection, serializer, scope = nil)
    ActiveModel::Serializer::CollectionSerializer.new(
      collection,
      serializer: serializer,
      scope: scope
    ).to_json.html_safe
  end

  def camelized_collection_json(collection, serializer, scope = nil, deep_nest = nil)
    camelized_collection(collection, serializer, scope, deep_nest).to_json.html_safe
  end

  def camelized_collection(collection, serializer, scope = nil, deep_nest = nil)
    collection.map do |resource|
      ActiveModelSerializers::SerializableResource.new(
        resource,
        serializer: serializer,
        key_transform: :camel_lower,
        scope: scope,
        include: deep_nest
      ).as_json
    end
  end

  def camelized_serializer(resource, serializer, scope = nil, deep_nest = nil)
    ActiveModelSerializers::SerializableResource.new(
      resource,
      serializer: serializer,
      key_transform: :camel_lower,
      scope: scope,
      include: deep_nest
    ).to_json.html_safe
  end

  def application_version
    ApplicationVersion.version
  end

  def logged_in_user_info_json
    if @current_user.present?
      {
        id: @current_user.id,
        name: @current_user.full_name,
        rollbar_guid: @current_user.rollbar_guid
      }
    end
  end

  def negative?(number)
    number < 0
  end

  def positive?(number)
    number > 0
  end
end
