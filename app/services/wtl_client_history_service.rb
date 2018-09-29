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
      if changeset.key?("wtl_card_id")
        from, to = changeset["wtl_card_id"]
        from = WtlCard.find_by(id: from).number if from.present?
        to = WtlCard.find_by(id: to).number if to.present?
        changeset["card_number"] = [from, to]
      end
      acc[created_at.iso8601] = {
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
