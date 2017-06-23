module ApplicationHelper
  def api_v1_collection_json(collection, serializer, scopes = nil)
    ActiveModel::Serializer::CollectionSerializer.new(
      collection,
      serializer: serializer,
      scopes: scopes
    ).to_json.html_safe
  end

  def application_version
    @versions_file = "#{ Rails.root }/.version_number"
    unless File.file?(@versions_file)
      File.open(@versions_file, 'w') do |f|
        f.puts "0.1"
      end
    end
    File.read(@versions_file).strip
  end

  def venues_for(staff_member)
    venues = ([staff_member.master_venue] + staff_member.work_venues.to_a).compact

    if venues.present?
      venues.map(&:name).to_sentence
    else
      'N / A'
    end
  end
end
