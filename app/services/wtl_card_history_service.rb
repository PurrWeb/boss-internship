class WtlCardHistoryService
  def initialize(wtl_card:)
    @wtl_card = wtl_card
  end

  def call
    result1 = wtl_card.versions.inject({}) do |acc, version|
      event = version.event
      whodunnit = JSON.parse(version.whodunnit)
      created_at = version.created_at
      changeset = version.changeset
      full_name = whodunnit.present? ? whodunnit["full_name"] : "System"

      acc[created_at] = {
        by: full_name,
        to: nil,
        event: event,
        changeset: {
          state: changeset["state"],
          number: changeset["number"],
        },
      }
      acc
    end

    result2 = WtlCardsHistory.where(wtl_card: wtl_card).inject({}) do |acc, history|
      client = history.wtl_client
      user = history.user
      created_at = history.created_at
      acc[created_at] = {
        by: user.andand.full_name,
        to: client.andand.full_name,
        event: history_event(client: client, user: user),
      }
      acc
    end

    result1.merge(result2)
  end

  private

  attr_reader :wtl_card

  def history_event(client:, user:)
    return "registered" if client.present? && user == nil
    return "assigned" if client.present? && user.present?
    return "unassigned" if client == nil && user.present?
  end
end
