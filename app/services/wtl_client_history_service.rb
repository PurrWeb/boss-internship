class WtlClientHistoryService
  def initialize(wtl_client:)
    @wtl_client = wtl_client
  end

  def call
    wtl_client.versions.inject({}) do |acc, version|
      event = version.event
      whodunnit = JSON.parse(version.whodunnit)
      created_at = version.created_at
      changeset = version.changeset
      full_name = whodunnit.present? ? whodunnit["full_name"] : "System"

      acc[created_at] = {
        by: full_name,
        to: nil,
        event: event,
        changeset: changeset,
      }
      acc
    end
  end

  private

  attr_reader :wtl_client
end
