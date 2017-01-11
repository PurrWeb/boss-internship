class UpdatePoolLoftTableSessionEditsFromJson
  def initialize(json:, nested: false)
    @json = Array.wrap(json)
    @nested = nested
  end
  attr_reader :json, :nested

  def call
    ActiveRecord::Base.transaction(requires_new: nested) do
      json.each do |table_session_edit_json|
        existing_session_edit = PoolLoftTableSessionEdit.find_by(
          guid: table_session_edit_json.fetch("guid")
        )

        if existing_session_edit.present?
          existing_session_edit.
            update_attributes!(
              id: table_session_edit_json.fetch("id"),
              guid: table_session_edit_json.fetch("guid"),
              admin_token_id: table_session_edit_json.fetch("admin_token_id"),
              admin_token_guid: table_session_edit_json.fetch("admin_token_guid"),
              table_session_id: table_session_edit_json.fetch("table_session_id"),
              table_session_guid: table_session_edit_json.fetch("table_session_guid"),
              old_duration_seconds: table_session_edit_json.fetch("old_duration_seconds"),
              new_duration_seconds: table_session_edit_json.fetch("new_duration_seconds"),
              updated_at: table_session_edit_json.fetch("updated_at"),
              created_at: table_session_edit_json.fetch("created_at")
            )
        else
          PoolLoftTableSessionEdit.create!(
            id: table_session_edit_json.fetch("id"),
            guid: table_session_edit_json.fetch("guid"),
            admin_token_id: table_session_edit_json.fetch("admin_token_id"),
            admin_token_guid: table_session_edit_json.fetch("admin_token_guid"),
            table_session_id: table_session_edit_json.fetch("table_session_id"),
            table_session_guid: table_session_edit_json.fetch("table_session_guid"),
            old_duration_seconds: table_session_edit_json.fetch("old_duration_seconds"),
            new_duration_seconds: table_session_edit_json.fetch("new_duration_seconds"),
            updated_at: table_session_edit_json.fetch("updated_at"),
            created_at: table_session_edit_json.fetch("created_at")
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
