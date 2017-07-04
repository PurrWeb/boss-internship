module ApplicationHelper
  def api_v1_collection_json(collection, serializer, scopes = nil)
    ActiveModel::Serializer::CollectionSerializer.new(
      collection,
      serializer: serializer,
      scopes: scopes
    ).to_json.html_safe
  end

  def application_version
    ApplicationVersion.version
  end

  def venues_for(staff_member)
    venues = ([staff_member.master_venue] + staff_member.work_venues.to_a).compact

    if venues.present?
      venues.map(&:name).to_sentence
    else
      'N / A'
    end
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
