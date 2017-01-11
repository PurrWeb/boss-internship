class UpdatePoolLoftTableSessionsFromJson
  def initialize(json:, nested: false)
    @json = Array.wrap(json)
    @nested = nested
  end
  attr_reader :json, :nested

  def call
    ActiveRecord::Base.transaction(requires_new: nested) do
      json.each do |table_session_json|
        existing_session = PoolLoftTableSession.find_by(
          guid: table_session_json.fetch("guid")
        )

        if existing_session.present?
          existing_session.
            update_attributes!(
              id: table_session_json.fetch("id"),
              guid: table_session_json.fetch("guid"),
              duration_seconds: table_session_json.fetch("duration_seconds"),
              edited_by_admin: table_session_json.fetch("edited_by_admin"),
              starts_at: table_session_json.fetch("starts_at"),
              table_id: table_session_json.fetch("table_id"),
              table_name: table_session_json.fetch("table_name"),
              table_guid: table_session_json.fetch("table_guid"),
              table_type: table_session_json.fetch("table_type"),
              updated_at: table_session_json.fetch("updated_at"),
              created_at: table_session_json.fetch("created_at")
            )
        else
          PoolLoftTableSession.create!(
            id: table_session_json.fetch("id"),
            guid: table_session_json.fetch("guid"),
            duration_seconds: table_session_json.fetch("duration_seconds"),
            edited_by_admin: table_session_json.fetch("edited_by_admin"),
            starts_at: table_session_json.fetch("starts_at"),
            table_id: table_session_json.fetch("table_id"),
            table_name: table_session_json.fetch("table_name"),
            table_guid: table_session_json.fetch("table_guid"),
            table_type: table_session_json.fetch("table_type"),
            updated_at: table_session_json.fetch("updated_at"),
            created_at: table_session_json.fetch("created_at")
          )
        end
      end
    end

    true
  end

  def self.call(json:, nested: false)
    new(
      json: json,
      nested: nested
    ).call
  end
end
