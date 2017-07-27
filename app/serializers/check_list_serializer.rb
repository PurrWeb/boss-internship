class CheckListSerializer < ActiveModel::Serializer
  attributes :id, :name, :items, :venue_id

  def items
    ActiveModel::Serializer::CollectionSerializer.new(object.check_list_items, serializer: CheckListItemsSerializer)
  end

  def venue_id
    object.venue.id
  end
end
